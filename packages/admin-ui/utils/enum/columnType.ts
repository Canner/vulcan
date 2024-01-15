export enum COLUMN_TYPE {
  // Boolean
  BOOLEAN = 'BOOLEAN',

  // Date and Time
  DATE = 'DATE',
  TIME = 'TIME',
  TIMESTAMP = 'TIMESTAMP',

  // Integer
  INTEGER = 'INTEGER',
  TINYINT = 'TINYINT',
  SMALLINT = 'SMALLINT',
  BIGINT = 'BIGINT',
  INT = 'INT',

  // Floating-Point
  DOUBLE = 'DOUBLE',
  REAL = 'REAL',

  // Fixed-Precision
  DECIMAL = 'DECIMAL',

  // String
  CHAR = 'CHAR',
  JSON = 'JSON',
  TEXT = 'TEXT',
  VARBINARY = 'VARBINARY',
  VARCHAR = 'VARCHAR',

  // Mongo DB
  MONGO_ARRAY = 'ARRAY',
  MONGO_ROW = 'ROW',
}