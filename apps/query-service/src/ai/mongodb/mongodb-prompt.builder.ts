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

export class MongoPromptBuilder implements PromptBuilder<PromptInput> {
  build(input: PromptInput): string {
    const metadata = input.metadata;

    return `
You are an expert MongoDB engineer.

Your job is to generate ONLY valid MongoDB Query Language.

======================== RULES ========================

- Return ONLY MongoDB query.
- Never explain anything.
- Never use markdown.
- Never wrap code inside \`\`\`.
- Use ONLY the metadata provided.
- Never invent collections.
- Never invent fields.
- Never invent references.
- Prefer aggregate() when joins or grouping are required.
- Use \$lookup only when relationships exist.
- If metadata is insufficient, return:
CANNOT_GENERATE_QUERY

=======================================================

DATABASE TYPE
-------------
MongoDB

DATABASE
--------
Name    : ${metadata.databaseInfo.database}
Version : ${metadata.databaseInfo.version}
Size    : ${metadata.databaseInfo.size ?? "Unknown"}

SCHEMAS
-------
${this.formatSchemas(metadata.schemas)}

=======================================================

${this.formatCollections(metadata.tables, metadata.columns, metadata.primaryKeys, metadata.indexes)}

=======================================================

REFERENCES
----------
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

  private formatCollections(
    collections: TableInfo[],
    fields: Record<string, ColumnInfo[]>,
    primaryKeys: Record<string, PrimaryKeyInfo>,
    indexes: IndexInfo[]
  ): string {
    if (collections.length === 0) {
      return "No collections found.";
    }

    return collections
      .map((collection) => {
        const collectionFields = fields[collection.name] ?? [];
        const pkFields = primaryKeys[collection.name]?.columns ?? [];

        const collectionIndexes = indexes.filter((index) => index.table === collection.name);

        const fieldText =
          collectionFields.length === 0
            ? "  None"
            : collectionFields
                .map((field) => {
                  const pk = pkFields.includes(field.name) ? " PRIMARY KEY" : "";

                  const nullable = field.nullable ? "" : " REQUIRED";

                  return `  • ${field.name} (${field.type})${nullable}${pk}`;
                })
                .join("\n");

        const indexText =
          collectionIndexes.length === 0
            ? "  None"
            : collectionIndexes
                .map((index) => `  • ${index.index}${index.unique ? " (UNIQUE)" : ""}`)
                .join("\n");

        return `
Collection: ${collection.name}
----------------------------------------

Fields

${fieldText}

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
