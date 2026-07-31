import { DatabaseType } from "@queryflow/database";
import { ConnectionRepository } from "../repositories/connection.repository.js";
import { decrypt, encrypt } from "../utils/encryption.js";
import { ConnectorFactory } from "../factories/connector.factory.js";
import { TableReaderFactory } from "../schema/factories/table-reader.factory.js";

export class ConnectionService {
  constructor(private readonly connectionRepository: ConnectionRepository) {}

  async createConnection(data: {
    name: string;
    databaseType: DatabaseType;
    databaseUrl: string;
    ownerId: string;
  }) {
    const encryptedUrl = encrypt(data.databaseUrl);

    return this.connectionRepository.create({
      name: data.name,
      databaseType: data.databaseType,
      encryptedUrl,
      ownerId: data.ownerId,
      isActive: true
    });
  }

  async getConnections(ownerId: string) {
    return this.connectionRepository.findByOwner(ownerId);
  }

  async getConnection(id: string, ownerId: string) {
    return this.connectionRepository.findByIdAndOwner(id, ownerId);
  }

  async deleteConnection(id: string, ownerId: string) {
    const connection = await this.connectionRepository.findByIdAndOwner(id, ownerId);

    if (!connection) {
      throw new Error("Connection not found");
    }

    return this.connectionRepository.delete(connection.id);
  }

  decryptConnectionUrl(encryptedUrl: string) {
    return decrypt(encryptedUrl);
  }

  async testConnection(connectionId: string, ownerId: string) {
    const connection = await this.connectionRepository.findByIdAndOwner(connectionId, ownerId);

    if (!connection) {
      throw new Error("Connection not found");
    }

    const connectionString = decrypt(connection.encryptedUrl);

    const connector = ConnectorFactory.create(connection.databaseType, connectionString);

    await connector.testConnection();

    return {
      success: true,
      message: "Database connection established successfully."
    };
  }

  async getTables(connectionId: string, ownerid: string) {
    const connection = await this.connectionRepository.findByIdAndOwner(connectionId, ownerid);

    if (!connection) {
      throw new Error("Connection not found");
    }

    const connectionString = decrypt(connection.encryptedUrl);

    const connector = ConnectorFactory.create(connection.databaseType, connectionString);

    await connector.connect();

    try {
      const client = await connector.getClient();

      const tableReader = TableReaderFactory.create(connection.databaseType, client);

      return await tableReader.getTables();
    } finally {
      await connector.disconnect();
    }
  }
}
