import { CompleteMetadata } from "../complete-metadata.js";

const SENSITIVE_COLUMNS = new Set([
  "password",
  "passwordhash",
  "token",
  "refreshtoken",
  "accesstoken",
  "secret",
  "apikey",
  "api_key",
  "otp",
  "verificationcode",
  "verification_code"
]);

export class MetadataSanitizer {
  static sanitize(metadata: CompleteMetadata): CompleteMetadata {
    const sanitizedColumns: typeof metadata.columns = {};

    for (const [tableName, columns] of Object.entries(metadata.columns)) {
      sanitizedColumns[tableName] = columns.filter(
        (column) => !SENSITIVE_COLUMNS.has(column.name.toLowerCase())
      );
    }

    return {
      ...metadata,
      columns: sanitizedColumns
    };
  }
}
