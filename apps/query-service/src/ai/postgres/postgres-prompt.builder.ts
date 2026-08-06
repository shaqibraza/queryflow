import { PromptBuilder } from "../interfaces/prompt-builder.js";
import { PromptInput } from "../types/prompt-input.js";

import {
  ColumnInfo,
  FunctionInfo,
  IndexInfo,
  PrimaryKeyInfo,
  RelationInfo,
  SchemaInfo,
  TableInfo,
  ViewInfo
} from "../../metadata/types.js";

export class PostgresPromptBuilder implements PromptBuilder<PromptInput> {
  build(input: PromptInput): string {
    const metadata = input.metadata;

    return `
You are a senior PostgreSQL database engineer.

Generate syntactically correct PostgreSQL SQL only.

Target database version:
${metadata.databaseInfo.version}

Rules:
- Use only PostgreSQL syntax.
- Never use MySQL, SQL Server, Oracle or SQLite syntax.
- Use only the schema provided.
- Never invent tables, columns or relationships.
- If information is missing return:
CANNOT_GENERATE_QUERY

Your job is to generate ONLY valid PostgreSQL SQL.

======================== RULES ========================

- Return ONLY SQL.
- Never explain the query.
- Never use markdown.
- Never wrap SQL inside \`\`\`.
- Use ONLY the metadata provided below.
- Never invent schemas.
- Never invent tables.
- Never invent columns.
- Never invent relationships.
- Prefer explicit column names over SELECT *.
- If metadata is insufficient, return:
CANNOT_GENERATE_QUERY

=======================================================

DATABASE TYPE
-------------
PostgreSQL

DATABASE
--------
Name    : ${metadata.databaseInfo.database}
Version : ${metadata.databaseInfo.version}
Size    : ${metadata.databaseInfo.size ?? "Unknown"}

SCHEMAS
-------
${this.formatSchemas(metadata.schemas)}

=======================================================

${this.formatTables(metadata.tables, metadata.columns, metadata.primaryKeys, metadata.indexes)}

=======================================================

RELATIONSHIPS
-------------
${this.formatRelations(metadata.relations)}

=======================================================

VIEWS
-----
${this.formatViews(metadata.views)}

=======================================================

FUNCTIONS
---------
${this.formatFunctions(metadata.functions)}

=======================================================

USER QUESTION
-------------
${input.question}
`;
  }

  private formatSchemas(schemas: SchemaInfo[]): string {
    if (schemas.length === 0) {
      return "None";
    }

    return schemas.map((schema) => `• ${schema.name}`).join("\n");
  }

  private formatTables(
    tables: TableInfo[],
    columns: Record<string, ColumnInfo[]>,
    primaryKeys: Record<string, PrimaryKeyInfo>,
    indexes: IndexInfo[]
  ): string {
    if (tables.length === 0) {
      return "No tables found.";
    }

    return tables
      .map((table) => {
        const tableColumns = columns[table.name] ?? [];

        const pkColumns = primaryKeys[table.name]?.columns ?? [];

        const tableIndexes = indexes.filter((index) => index.table === table.name);

        const columnText =
          tableColumns.length === 0
            ? "  None"
            : tableColumns
                .map((column) => {
                  const nullable = column.nullable ? "" : " NOT NULL";

                  const primaryKey = pkColumns.includes(column.name) ? " PRIMARY KEY" : "";

                  const defaultValue =
                    column.default !== null && column.default !== undefined
                      ? ` DEFAULT ${column.default}`
                      : "";

                  return `  • ${column.name} (${column.type})${nullable}${primaryKey}${defaultValue}`;
                })
                .join("\n");

        const indexText =
          tableIndexes.length === 0
            ? "  None"
            : tableIndexes
                .map((index) => `  • ${index.index}${index.unique ? " (UNIQUE)" : ""}`)
                .join("\n");

        return `
Table: ${table.name}
----------------------------------------
Schema : ${table.schema}
Type   : ${table.type}

Columns
${columnText}

Indexes
${indexText}
`;
      })
      .join("\n");
  }

  private formatRelations(relations: RelationInfo[]): string {
    if (relations.length === 0) {
      return "None";
    }

    return relations
      .map(
        (relation) =>
          `• ${relation.fromTable}.${relation.fromColumn} -> ${relation.toTable}.${relation.toColumn}`
      )
      .join("\n");
  }

  private formatViews(views: ViewInfo[]): string {
    if (views.length === 0) {
      return "None";
    }

    return views.map((view) => `• ${view.schema}.${view.name}`).join("\n");
  }

  private formatFunctions(functions: FunctionInfo[]): string {
    if (functions.length === 0) {
      return "None";
    }

    return functions.map((func) => `• ${func.schema}.${func.name} (${func.type})`).join("\n");
  }
}
