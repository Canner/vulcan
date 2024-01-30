import GraphQLJSON from 'graphql-type-json';
import {
  UsableDataSource,
  DataSourceName,
  DataSource,
  Relation,
  CreateModelPayload,
  UpdateModelPayload,
  UpdateModelWhere,
  DeleteModelWhere,
  GetModelWhere,
  CompactTable,
} from './types';
import * as demoManifest from './manifest.json';
import { pick } from 'lodash';

export const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    usableDataSource: () =>
      [
        {
          type: DataSourceName.BIG_QUERY,
          requiredProperties: ['displayName', 'projectId', 'credentials'],
        },
      ] as UsableDataSource[],
    listDataSourceTables: () =>
      [
        {
          name: 'orders',
          columns: [
            {
              name: 'id',
              type: 'string',
            },
            {
              name: 'customerId',
              type: 'string',
            },
            {
              name: 'productId',
              type: 'string',
            },
          ],
        },
        {
          name: 'customers',
          columns: [
            {
              name: 'id',
              type: 'string',
            },
            {
              name: 'name',
              type: 'string',
            },
          ],
        },
        {
          name: 'products',
          columns: [
            {
              name: 'id',
              type: 'string',
            },
            {
              name: 'name',
              type: 'string',
            },
          ],
        },
      ] as CompactTable[],
    autoGenerateRelation: () => [],
    manifest: () => demoManifest,
    listModels: () => {
      const { models } = demoManifest;
      return models.map((model) => ({
        ...pick(model, [
          'name',
          'refSql',
          'primaryKey',
          'cached',
          'refreshTime',
          'description',
        ]),
      }));
    },
    getModel: (_, args: { where: GetModelWhere }) => {
      const { where } = args;
      const { models } = demoManifest;
      const model = models.find((model) => model.name === where.name);
      return {
        ...pick(model, [
          'name',
          'refSql',
          'primaryKey',
          'cached',
          'refreshTime',
          'description',
        ]),
        columns: model.columns.map((column) => ({
          ...pick(column, [
            'name',
            'type',
            'isCalculated',
            'notNull',
            'properties',
          ]),
        })),
        properties: model.properties,
      };
    },
  },
  Mutation: {
    saveDataSource: (_, args: { data: DataSource }) => {
      return args.data;
    },
    saveMDL: (
      _,
      args: {
        data: {
          models: { name: string; columns: string[] };
          relations: Relation[];
        };
      }
    ) => {
      return demoManifest;
    },
    createModel: (_, args: { data: CreateModelPayload }) => {
      const { data } = args;
      const { fields = [], customFields = [], calculatedFields = [] } = data;
      return {
        name: data.tableName,
        refSql: `SELECT * FROM ${data.tableName}`,
        columns: [
          ...fields.map((field) => ({
            name: field,
            type: 'string',
            isCalculated: false,
            notNull: false,
            properties: {},
          })),
          ...customFields.map((field) => ({
            name: field.name,
            type: 'string',
            isCalculated: false,
            notNull: false,
            properties: {},
          })),
          ...calculatedFields.map((field) => ({
            name: field.name,
            type: 'string',
            isCalculated: true,
            notNull: false,
            properties: {},
          })),
        ],
        properties: {
          displayName: data.displayName,
          description: data.description,
        },
      };
    },
    updateModel: (
      _,
      args: { where: UpdateModelWhere; data: UpdateModelPayload }
    ) => {
      const { where, data } = args;
      const { models } = demoManifest;
      const model =
        models.find((model) => model.name === where.name) || models[0];
      return {
        ...pick(model, [
          'name',
          'refSql',
          'primaryKey',
          'cached',
          'refreshTime',
          'description',
        ]),
        columns: model.columns.map((column) => ({
          ...pick(column, [
            'name',
            'type',
            'isCalculated',
            'notNull',
            'properties',
          ]),
        })),
        properties: {
          ...model.properties,
          displayName: data.displayName,
          description: data.description,
        },
      };
    },
    deleteModel: (_, args: { where: DeleteModelWhere }) => {
      return true;
    },
  },
};