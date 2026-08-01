import type { Collection, Document, MongoClient } from "mongodb";
import type { ColumnMetadata } from "../interfaces/column-metadata.js";
import type { TableMetadata } from "../interfaces/table-metadata.js";
import type { RelationMetadata } from "../interfaces/relation-metadata.js";
import type { IndexMetadata } from "../interfaces/index-metadata.js";
import type { ViewMetadata } from "../interfaces/view-metadata.js";
import type { FunctionMetadata } from "../interfaces/function-metadata.js";
import type { DatabaseInfo } from "../interfaces/database-info.js";
import { formatByteSize } from "../utils/format-byte-size.js";
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

  async getPrimaryKeys(tableName: string): Promise<string[]> {
    const collection = await this.client
      .db()
      .listCollections({ name: tableName }, { nameOnly: true })
      .next();

    // Every MongoDB document has a unique _id field; MongoDB does not support
    // relational/composite primary-key constraints.
    return collection ? ["_id"] : [];
  }

  async getRelations(): Promise<RelationMetadata[]> {
    // MongoDB does not enforce foreign-key constraints. Application-level
    // references are intentionally not guessed from field names or sampled data.
    return [];
  }

  async getIndexes(): Promise<IndexMetadata[]> {
    const collections = await this.client.db().listCollections({}, { nameOnly: true }).toArray();
    const indexes = await Promise.all(
      collections.map(async ({ name }) => {
        const collectionIndexes = await this.client.db().collection(name).listIndexes().toArray();

        return collectionIndexes.map((index) => ({
          table: name,
          index: index.name,
          unique: index.unique === true || index.name === "_id_"
        }));
      })
    );

    return indexes
      .flat()
      .sort((left, right) =>
        left.table === right.table
          ? left.index.localeCompare(right.index)
          : left.table.localeCompare(right.table)
      );
  }

  async getViews(): Promise<ViewMetadata[]> {
    const views = await this.client
      .db()
      .listCollections({ type: "view" }, { nameOnly: true })
      .toArray();

    return views
      .map((view) => ({
        schema: this.client.db().databaseName,
        name: view.name
      }))
      .sort((left, right) => left.name.localeCompare(right.name));
  }

  async getFunctions(): Promise<FunctionMetadata[]> {
    // MongoDB has no database-level catalog of stored functions or procedures.
    return [];
  }

  async getDatabaseInfo(): Promise<DatabaseInfo> {
    const database = this.client.db();
    const [stats, buildInfo] = await Promise.all([
      database.stats(),
      database.admin().command({ buildInfo: 1 })
    ]);

    return {
      database: database.databaseName,
      version: `MongoDB ${buildInfo.version}`,
      size: formatByteSize(stats.dataSize)
    };
  }

  async getSchemas(): Promise<string[]> {
    // MongoDB namespaces are database + collection; the connected database is
    // therefore the only schema-level namespace exposed by this connection.
    return [this.client.db().databaseName];
  }
}
