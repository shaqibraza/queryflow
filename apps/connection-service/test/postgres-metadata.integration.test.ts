import { describe, expect, it } from "vitest";
import { PostgresConnector } from "../src/connectors/postgres.connector.js";
import { PostgresTableReader } from "../src/schema/postgres/postgres-table-reader.js";

const databaseUrl = process.env.DATABASE_URL;
const integrationEnabled = process.env.RUN_DATABASE_INTEGRATION === "true" && Boolean(databaseUrl);

describe.skipIf(!integrationEnabled)("PostgreSQL metadata integration", () => {
  it("discovers metadata using a live database without changing it", async () => {
    const connector = new PostgresConnector(databaseUrl!);

    await connector.connect();

    try {
      const reader = new PostgresTableReader(connector.getClient());
      const tables = await reader.getTables();

      expect(Array.isArray(tables)).toBe(true);
      expect(Array.isArray(await reader.getRelations())).toBe(true);
      expect(Array.isArray(await reader.getIndexes())).toBe(true);
      expect(Array.isArray(await reader.getViews())).toBe(true);
      expect(Array.isArray(await reader.getFunctions())).toBe(true);
      expect((await reader.getSchemas()).length).toBeGreaterThan(0);

      const info = await reader.getDatabaseInfo();
      expect(info.database).toBeTruthy();
      expect(info.version).toContain("PostgreSQL");
      expect(info.size).toBeTruthy();

      if (tables[0]) {
        expect(Array.isArray(await reader.getColumns(tables[0].name))).toBe(true);
        expect(Array.isArray(await reader.getPrimaryKeys(tables[0].name))).toBe(true);
      }
    } finally {
      await connector.disconnect();
    }
  });
});
