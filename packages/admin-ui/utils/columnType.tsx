import {
  NumericIcon,
  ColumnsIcon,
  JsonBracesIcon,
  ArrayBracketsIcon,
  StringIcon,
  TextIcon,
  CalendarIcon,
  TickIcon,
} from './icons';
import { COLUMN_TYPE } from './enum';

export const getColumnTypeIcon = (columnType: string) => {
  switch (columnType.toUpperCase()) {
    case COLUMN_TYPE.INTEGER:
    case COLUMN_TYPE.TINYINT:
    case COLUMN_TYPE.SMALLINT:
    case COLUMN_TYPE.BIGINT:
    case COLUMN_TYPE.INT:
    case COLUMN_TYPE.DECIMAL:
    case COLUMN_TYPE.DOUBLE:
    case COLUMN_TYPE.REAL:
      return <NumericIcon />;

    case COLUMN_TYPE.BOOLEAN:
      return <TickIcon />;

    case COLUMN_TYPE.CHAR:
    case COLUMN_TYPE.JSON:
    case COLUMN_TYPE.VARBINARY:
    case COLUMN_TYPE.VARCHAR:
      return <StringIcon />;

    case COLUMN_TYPE.TEXT:
      return <TextIcon />;

    case COLUMN_TYPE.DATE:
    case COLUMN_TYPE.TIME:
    case COLUMN_TYPE.TIMESTAMP:
      return <CalendarIcon />;

    case COLUMN_TYPE.MONGO_ARRAY:
      return <ArrayBracketsIcon />;

    case COLUMN_TYPE.MONGO_ROW:
      return <JsonBracesIcon />;

    default:
      return <ColumnsIcon />;
  }
};
