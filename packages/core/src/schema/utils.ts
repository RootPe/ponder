import type {
  Column,
  Constraints,
  Enum,
  EnumColumn,
  ManyColumn,
  OneColumn,
  ReferenceColumn,
  ScalarColumn,
  Schema,
  Table,
} from "./common.js";

export const isScalarColumn = (column: Column): column is ScalarColumn =>
  column[" type"] === "scalar";

export const isReferenceColumn = (column: Column): column is ReferenceColumn =>
  column[" type"] === "reference";

export const isOneColumn = (column: Column): column is OneColumn =>
  column[" type"] === "one";

export const isManyColumn = (column: Column): column is ManyColumn =>
  column[" type"] === "many";

export const isEnumColumn = (column: Column): column is EnumColumn =>
  column[" type"] === "enum";

export const isOptionalColumn = (column: Column): boolean => {
  if (isManyColumn(column) || isOneColumn(column)) return false;
  return column[" optional"];
};

export const isListColumn = (column: Column): boolean => {
  if (isManyColumn(column) || isOneColumn(column) || isReferenceColumn(column))
    return false;
  return column[" list"];
};

export const isTable = (
  tableOrEnum: Schema[string],
): tableOrEnum is { table: Table; constraints: Constraints } =>
  !Array.isArray(tableOrEnum);

export const isEnum = (tableOrEnum: Schema[string]): tableOrEnum is Enum =>
  Array.isArray(tableOrEnum);

export const getTables = (
  schema: Schema,
): { [tableName: string]: { table: Table; constraints: Constraints } } => {
  const tables: {
    [tableName: string]: { table: Table; constraints: Constraints };
  } = {};

  for (const [name, tableOrEnum] of Object.entries(schema)) {
    if (isTable(tableOrEnum)) {
      tables[name] = tableOrEnum;
    }
  }

  return tables;
};

export const getEnums = (schema: Schema): { [enumName: string]: Enum } => {
  const enums: { [enumName: string]: Enum } = {};

  for (const [name, tableOrEnum] of Object.entries(schema)) {
    if (isEnum(tableOrEnum)) {
      enums[name] = tableOrEnum;
    }
  }

  return enums;
};

export const extractReferenceTable = (ref: ReferenceColumn): string => {
  return ref[" reference"].split(".")[0];
};

export const encodeSchema = (schema: Schema) => {
  return JSON.stringify({
    tables: getTables(schema),
    enums: getEnums(schema),
  });
};
