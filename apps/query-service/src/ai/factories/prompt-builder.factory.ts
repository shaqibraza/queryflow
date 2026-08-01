import { DatabaseType } from "@queryflow/database";
import { PromptBuilder } from "../interfaces/prompt-builder.js";
import { PostgresPromptBuilder } from "../postgres/postgres-prompt.builder.js";
import { MysqlPromptBuilder } from "../mysql/mysql-prompt.builder.js";
import { MongoPromptBuilder } from "../mongodb/mongodb-prompt.builder.js";

export class PromptBuilderFactory {
  static create(databaseType: DatabaseType): PromptBuilder {
    switch (databaseType) {
      case DatabaseType.POSTGRESQL:
        return new PostgresPromptBuilder();

      case DatabaseType.MYSQL:
        return new MysqlPromptBuilder();

      case DatabaseType.MONGODB:
        return new MongoPromptBuilder();

      default:
        throw new Error(`Prompt builder not implemented for ${databaseType}`);
    }
  }
}
