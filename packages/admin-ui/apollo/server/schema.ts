import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
  scalar JSON

  enum DataSourceName {
    BIG_QUERY
  }

  type UsableDataSource {
    type: DataSourceName!
    requiredProperties: [String!]!
  }

  type DataSource {
    type: DataSourceName!
    properties: JSON!
  }

  input DataSourceInput {
    type: DataSourceName!
    properties: JSON!
  }

  type CompactTable {
    name: String!
    columns: [CompactColumn!]!
  }

  input MDLModelSubmitInput {
    name: String!
    columns: [String!]!
  }

  enum RelationType {
    ONE_TO_ONE
    ONE_TO_MANY
    MANY_TO_ONE
    MANY_TO_MANY
  }

  type Relation {
    fromModel: Int!
    fromColumn: Int!
    toModel: Int!
    toColumn: Int!
    type: RelationType!
    name: String!
  }

  type RecommandRelations {
    name: String!
    id: Int!
    relations: [Relation]!
  }

  input RelationInput {
    name: String!
    fromModel: Int!
    fromColumn: Int!
    toModel: Int!
    toColumn: Int!
    type: RelationType!
  }

  input SaveRelationInput {
    relations: [RelationInput]!
  }

  input SaveTablesInput {
    tables: [ModelsInput!]!
  }

  input ModelsInput {
    name: String!
    columns: [String!]!
  }

  type CompactColumn {
    name: String!
    type: String!
  }

  input CustomFieldInput {
    name: String!
    expression: String!
  }

  input CalculatedFieldInput {
    name: String!
    expression: String!
    lineage: [Int!]!
    diagram: JSON
  }

  input CreateModelInput {
    name: String!
    tableName: String!
    displayName: String!
    refSql: String
    description: String
    cached: Boolean!
    refreshTime: String
    fields: [String!]!
    caculatedFields: [CaculatedFieldInput!]
  }

  input ModelWhereInput {
    id: Int!
  }

  input UpdateModelInput {
    displayName: String!
    description: String
    cached: Boolean!
    refreshTime: String
    fields: [String!]!
    caculatedFields: [CaculatedFieldInput!]
  }

  type ColumnInfo {
    id: Int!
    name: String!
    type: String!
    isCalculated: Boolean!
    notNull: Boolean!
    expression: String
    properties: JSON
  }

  type ModelInfo {
    id: Int!
    name: String!
    refSql: String
    primaryKey: String
    cached: Boolean!
    refreshTime: String
    description: String
    columns: [ColumnInfo]!
    properties: JSON
  }

  type DetailedColumn {
    name: String!
    type: String!
    isCalculated: Boolean!
    notNull: Boolean!
    properties: JSON!
  }

  type DetailedRelation {
    fromModelId: Int!
    fromColumnId: Int!
    toModelId: Int!
    toColumnId: Int!
    type: RelationType!
    name: String!
  }

  type DetailedModel {
    name: String!
    refSql: String!
    primaryKey: String
    cached: Boolean!
    refreshTime: String
    description: String
    columns: [DetailedColumn!]!
    relations: [DetailedRelation]
    properties: JSON!
  }

  input SimpleMeasureInput {
    name: String!
    type: String!
    isCalculated: Boolean!
    notNull: Boolean!
    properties: JSON!
  }

  input DimensionInput {
    name: String!
    type: String!
    isCalculated: Boolean!
    notNull: Boolean!
    properties: JSON!
  }

  input TimeGrainInput {
    name: String!
    refColumn: String!
    dateParts: [String!]!
  }

  input CreateSimpleMetricInput {
    name: String!
    displayName: String!
    description: String
    cached: Boolean!
    refreshTime: String
    model: String!
    properties: JSON!
    measure: [SimpleMeasureInput!]!
    dimension: [DimensionInput!]!
    timeGrain: [TimeGrainInput!]!
  }

  type Query {
    # On Boarding Steps
    usableDataSource: [UsableDataSource!]!
    listDataSourceTables: [CompactTable!]!
    autoGenerateRelation: [RecommandRelations!]
    manifest: JSON!

    # Modeling Page
    listModels: [ModelInfo!]!
    model(where: ModelWhereInput!): DetailedModel!
  }

  type Mutation {
    # On Boarding Steps
    saveDataSource(data: DataSourceInput!): DataSource!
    saveTables(data: SaveTablesInput!): JSON!
    saveRelations(data: SaveRelationInput!): JSON!

    # Modeling Page
    createModel(data: CreateModelInput!): JSON!
    updateModel(where: ModelWhereInput!, data: UpdateModelInput!): JSON!
    deleteModel(where: ModelWhereInput!): Boolean!
  }
`;
