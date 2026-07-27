import type { DataSourceType } from "@queryflow/types";
import type { DatabaseConnector } from "./database-connector.js";

export class ConnectorRegistry {
  private readonly connectors = new Map<DataSourceType, DatabaseConnector>();

  register(connector: DatabaseConnector): void {
    this.connectors.set(connector.sourceType, connector);
  }

  get(sourceType: DataSourceType): DatabaseConnector {
    const connector = this.connectors.get(sourceType);

    if (!connector) {
      throw new Error(`Connector is not registered for data source type: ${sourceType}`);
    }

    return connector;
  }
}
