import { BigQueryOptions } from '@google-cloud/bigquery';
import {
  BQColumnResponse,
  BQConnector,
  BQConstraintResponse,
  BQListTableOptions,
} from '../connectors/bqConnector';
import {
  DataSource,
  DataSourceName,
  IContext,
  RelationData,
  RelationType,
} from '../types';
import { getLogger, Encryptor } from '@vulcan-sql/admin-ui/apollo/server/utils';
import { Model, ModelColumn, Project } from '../repositories';
import { CreateModelsInput } from '../models';

const logger = getLogger('DataSourceResolver');
logger.level = 'debug';

export class ProjectResolver {
  constructor() {
    this.saveDataSource = this.saveDataSource.bind(this);
    this.listDataSourceTables = this.listDataSourceTables.bind(this);
    this.saveTables = this.saveTables.bind(this);
    this.autoGenerateRelation = this.autoGenerateRelation.bind(this);
    this.saveRelations = this.saveRelations.bind(this);
  }

  public async saveDataSource(
    _root: any,
    args: {
      data: DataSource;
    },
    ctx: IContext
  ) {
    const { type, properties } = args.data;
    if (type === DataSourceName.BIG_QUERY) {
      await this.saveBigQueryDataSource(properties, ctx);
      return args.data;
    }
  }

  public async listDataSourceTables(_root: any, arg, ctx: IContext) {
    const project = await ctx.projectService.getCurrentProject();
    const filePath = await ctx.projectService.getCredentialFilePath(project);
    const connector = await this.getBQConnector(project, filePath);
    const listTableOptions: BQListTableOptions = {
      dataset: project.dataset,
      format: true,
    };
    return await connector.listTables(listTableOptions);
  }

  public async saveTables(
    _root: any,
    arg: {
      data: { tables: CreateModelsInput[] };
    },
    ctx: IContext
  ) {
    const tables = arg.data.tables;

    // get current project
    const project = await ctx.projectService.getCurrentProject();
    const filePath = await ctx.projectService.getCredentialFilePath(project);

    // get columns with descriptions
    const connector = await this.getBQConnector(project, filePath);
    const listTableOptions: BQListTableOptions = {
      dataset: project.dataset,
      format: false,
    };
    const dataSourceColumns = await connector.listTables(listTableOptions);
    // create models
    const id = project.id;
    const tableDescriptions = dataSourceColumns
      .filter((col: BQColumnResponse) => col.table_description)
      .reduce((acc, column: BQColumnResponse) => {
        acc[column.table_name] = column.table_description;
        return acc;
      }, {});
    const models = await this.createModels(tables, id, ctx, tableDescriptions);

    // create columns
    const columns = await this.createModelColumns(
      tables,
      models,
      dataSourceColumns as BQColumnResponse[],
      ctx
    );

    return { models, columns };
  }

  public async autoGenerateRelation(_root: any, arg: any, ctx: IContext) {
    const project = await ctx.projectService.getCurrentProject();
    const filePath = await ctx.projectService.getCredentialFilePath(project);
    const models = await ctx.modelRepository.findAllBy({
      projectId: project.id,
    });

    const connector = await this.getBQConnector(project, filePath);
    const listConstraintOptions = {
      dataset: project.dataset,
    };
    const constraints = await connector.listConstraints(listConstraintOptions);
    logger.log('constraints', constraints);
    const modelIds = models.map((m) => m.id);
    const columns = await ctx.modelColumnRepository.findColumnsByModelIds(
      modelIds
    );
    const relations = this.analysisRelation(constraints, models, columns);
    return models.map(({ id, sourceTableName }) => ({
      id,
      name: sourceTableName,
      relations: relations.filter((relation) => relation.fromModel === id),
    }));
  }

  public async saveRelations(
    _root: any,
    arg: { data: { relations: RelationData[] } },
    ctx: IContext
  ) {
    const { relations } = arg.data;
    const project = await ctx.projectService.getCurrentProject();

    // throw error if the relation name is duplicated
    const relationNames = relations.map((relation) => relation.name);
    if (new Set(relationNames).size !== relationNames.length) {
      throw new Error('Duplicated relation name');
    }

    const columnIds = relations
      .map(({ fromColumn, toColumn }) => [fromColumn, toColumn])
      .flat();
    const columns = await ctx.modelColumnRepository.findColumnsByIds(columnIds);
    const relationValues = relations.map((relation) => {
      const fromColumn = columns.find(
        (column) => column.id === relation.fromColumn
      );
      if (!fromColumn) {
        throw new Error(`Column not found, column Id ${relation.fromColumn}`);
      }
      const toColumn = columns.find(
        (column) => column.id === relation.toColumn
      );
      if (!toColumn) {
        throw new Error(`Column not found, column Id  ${relation.toColumn}`);
      }
      return {
        projectId: project.id,
        name: relation.name,
        fromColumnId: relation.fromColumn,
        toColumnId: relation.toColumn,
        joinType: relation.type,
      };
    });

    const savedRelations = await Promise.all(
      relationValues.map((relation) =>
        ctx.relationRepository.createOne(relation)
      )
    );
    return savedRelations;
  }

  private analysisRelation(
    constraints: BQConstraintResponse[],
    models: Model[],
    columns: ModelColumn[]
  ): RelationData[] {
    const relations = [];
    for (const constraint of constraints) {
      const {
        constraintTable,
        constraintColumn,
        constraintedTable,
        constraintedColumn,
      } = constraint;
      // validate tables and columns exists in our models and model columns
      const fromModel = models.find(
        (m) => m.sourceTableName === constraintTable
      );
      const toModel = models.find(
        (m) => m.sourceTableName === constraintedTable
      );
      if (!fromModel || !toModel) {
        continue;
      }
      const fromColumn = columns.find(
        (c) => c.modelId === fromModel.id && c.name === constraintColumn
      );
      const toColumn = columns.find(
        (c) => c.modelId === toModel.id && c.name === constraintedColumn
      );
      if (!fromColumn || !toColumn) {
        continue;
      }
      // create relation
      const relation = {
        // upper case the first letter of the sourceTableName
        name:
          fromModel.sourceTableName.charAt(0).toUpperCase() +
          fromModel.sourceTableName.slice(1) +
          toModel.sourceTableName.charAt(0).toUpperCase() +
          toModel.sourceTableName.slice(1),
        fromModel: fromModel.id,
        fromColumn: fromColumn.id,
        toModel: toModel.id,
        toColumn: toColumn.id,
        // TODO: add join type
        type: RelationType.ONE_TO_MANY,
      };
      relations.push(relation);
    }
    return relations;
  }

  private async getBQConnector(project: Project, filePath: string) {
    // fetch tables
    const { location, projectId } = project;
    const connectionOption: BigQueryOptions = {
      location,
      projectId,
      keyFilename: filePath,
    };
    return new BQConnector(connectionOption);
  }

  private async createModelColumns(
    tables: CreateModelsInput[],
    models: Model[],
    dataSourceColumns: BQColumnResponse[],
    ctx: IContext
  ) {
    const columnValues = tables.reduce((acc, table) => {
      const modelId = models.find((m) => m.sourceTableName === table.name)?.id;
      for (const columnName of table.columns) {
        const dataSourceColumn = dataSourceColumns.find(
          (c) => c.table_name === table.name && c.column_name === columnName
        );
        if (!dataSourceColumn) {
          throw new Error(
            `Column ${columnName} not found in the DataSource ${table.name}`
          );
        }
        const columnValue = {
          modelId,
          isCalculated: false,
          name: columnName,
          type: dataSourceColumn?.data_type || 'string',
          notNull: dataSourceColumn.is_nullable.toLocaleLowerCase() !== 'yes',
          isPk: false,
          properties: JSON.stringify({
            description: dataSourceColumn.column_description,
          }),
        } as Partial<ModelColumn>;
        acc.push(columnValue);
      }
      return acc;
    }, []);
    const columns = await Promise.all(
      columnValues.map(
        async (column) => await ctx.modelColumnRepository.createOne(column)
      )
    );
    return columns;
  }

  private async createModels(
    tables: CreateModelsInput[],
    id: number,
    ctx: IContext,
    tableDescriptions: { [key: string]: string }
  ) {
    const modelValues = tables.map(({ name }) => {
      const description = tableDescriptions[name];
      const model = {
        projectId: id,
        displayName: name, //use table name as displayName, referenceName and tableName
        referenceName: name,
        sourceTableName: name,
        refSql: `select * from ${name}`,
        cached: false,
        refreshTime: null,
        properties: JSON.stringify({ description }),
      } as Partial<Model>;
      return model;
    });

    const models = await Promise.all(
      modelValues.map(
        async (model) => await ctx.modelRepository.createOne(model)
      )
    );
    return models;
  }

  private async saveBigQueryDataSource(properties: any, ctx: IContext) {
    const { displayName, location, projectId, dataset, credentials } =
      properties;
    const { config } = ctx;
    let filePath = '';
    // check DataSource is valid and can connect to it
    filePath = ctx.projectService.writeCredentialsFile(
      credentials,
      config.persistCredentialDir
    );
    const connectionOption: BigQueryOptions = {
      location,
      projectId,
      keyFilename: filePath,
    };
    const connector = new BQConnector(connectionOption);
    const connected = await connector.connect();
    if (!connected) {
      throw new Error('Cannot connect to DataSource');
    }
    // check can list dataset table
    try {
      await connector.listTables({ dataset });
    } catch (e) {
      throw new Error('Cannot list tables in dataset');
    }
    // save DataSource to database
    const encryptor = new Encryptor(config);
    const encryptedCredentials = encryptor.encrypt(credentials);

    // TODO: add displayName, schema, catalog to the DataSource, depends on the MDL structure
    const project = await ctx.projectRepository.createOne({
      displayName,
      schema: 'tbd',
      catalog: 'tbd',
      type: DataSourceName.BIG_QUERY,
      projectId,
      location,
      dataset,
      credentials: encryptedCredentials,
    });
    return project;
  }
}
