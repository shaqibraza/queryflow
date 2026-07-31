import { PostgresConnector } from "./connectors/postgres.connector.js";

async function main() {
  const connector = new PostgresConnector("postgresql://postgres:123456@localhost:5432/postgres");

  try {
    console.log("Connecting...");

    await connector.connect();

    console.log("Connected");

    const client = connector.getClient();

    const result = await client.query("SELECT NOW()");

    console.log(result.rows);

    await connector.disconnect();

    console.log("Disconnected");
  } catch (error) {
    console.error(error);
  }
}

main();
