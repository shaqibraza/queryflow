import type { Collection, Document, MongoClient } from "mongodb";
import type { ColumnMetadata } from "../interfaces/column-metadata.js";
import type { TableMetadata } from "../interfaces/table-metadata.js";
import type { TableReader } from "../interfaces/table-reader.js";

const mongoType = (value: unknown): string => {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  if (value instanceof Date) return "date";
  if (value instanceof RegExp) return "regex";

  switch (typeof value) {
    case "object":
      return "object";
    case "number":
      return Number.isInteger(value) ? "int" : "double";
    default:
      return typeof value;
  }
};

export class MongoDbTableReader implements TableReader {
  constructor(private readonly client: MongoClient) {}

  async getTables(): Promise<TableMetadata[]> {
    const collections = await this.client.db().listCollections({}, { nameOnly: true }).toArray();

    return collections.map((collection) => ({
      schema: this.client.db().databaseName,
      name: collection.name,
      type: "BASE TABLE"
    }));
  }

  async getColumns(tableName: string): Promise<ColumnMetadata[]> {
    const collection: Collection<Document> = this.client.db().collection(tableName);
    const documents = await collection.find({}).limit(100).toArray();
    const columns = new Map<string, { types: Set<string>; present: number; hasNull: boolean }>();

    for (const document of documents) {
      for (const [name, value] of Object.entries(document)) {
        const column = columns.get(name) ?? {
          types: new Set<string>(),
          present: 0,
          hasNull: false
        };
        column.present += 1;
        column.hasNull ||= value === null;
        if (value !== null) column.types.add(mongoType(value));
        columns.set(name, column);
      }
    }

    return [...columns.entries()].map(([name, column]) => ({
      name,
      type: [...column.types].sort().join(" | ") || "null",
      // MongoDB has no enforced column nullability; this is inferred from up to 100 documents.
      nullable: column.hasNull || column.present < documents.length,
      default: null
    }));
  }
}
