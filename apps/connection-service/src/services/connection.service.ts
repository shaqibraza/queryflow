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

  async updateConnection(
    id: string,
    ownerId: string,
    data: {
      name?: string;
      databaseType?: DatabaseType;
      databaseUrl?: string;
    }
  ) {
    const connection = await this.connectionRepository.findByIdAndOwner(id, ownerId);

    if (!connection) {
      throw new Error("Connection not found");
    }

    return this.connectionRepository.update(connection.id, {
      name: data.name,
      databaseType: data.databaseType,
      encryptedUrl: data.databaseUrl ? encrypt(data.databaseUrl) : undefined
    });
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

  async getColumns(connectionId: string, ownerId: string, tableName: string) {
    const connection = await this.connectionRepository.findByIdAndOwner(connectionId, ownerId);

    if (!connection) {
      throw new Error("Connection not found");
    }

    const connector = ConnectorFactory.create(
      connection.databaseType,
      decrypt(connection.encryptedUrl)
    );

    await connector.connect();

    try {
      const tableReader = TableReaderFactory.create(connection.databaseType, connector.getClient());
      return await tableReader.getColumns(tableName);
    } finally {
      await connector.disconnect();
    }
  }

  async getPrimaryKeys(connectionId: string, ownerId: string, tableName: string) {
    const connection = await this.connectionRepository.findByIdAndOwner(connectionId, ownerId);

    if (!connection) {
      throw new Error("Connection not found");
    }

    const connector = ConnectorFactory.create(
      connection.databaseType,
      decrypt(connection.encryptedUrl)
    );

    await connector.connect();

    try {
      const tableReader = TableReaderFactory.create(connection.databaseType, connector.getClient());
      return await tableReader.getPrimaryKeys(tableName);
    } finally {
      await connector.disconnect();
    }
  }

  async getRelations(connectionId: string, ownerId: string) {
    const connection = await this.connectionRepository.findByIdAndOwner(connectionId, ownerId);

    if (!connection) {
      throw new Error("Connection not found");
    }

    const connector = ConnectorFactory.create(
      connection.databaseType,
      decrypt(connection.encryptedUrl)
    );

    await connector.connect();

    try {
      const tableReader = TableReaderFactory.create(connection.databaseType, connector.getClient());
      return await tableReader.getRelations();
    } finally {
      await connector.disconnect();
    }
  }

  async getIndexes(connectionId: string, ownerId: string) {
    const connection = await this.connectionRepository.findByIdAndOwner(connectionId, ownerId);

    if (!connection) {
      throw new Error("Connection not found");
    }

    const connector = ConnectorFactory.create(
      connection.databaseType,
      decrypt(connection.encryptedUrl)
    );

    await connector.connect();

    try {
      const tableReader = TableReaderFactory.create(connection.databaseType, connector.getClient());
      return await tableReader.getIndexes();
    } finally {
      await connector.disconnect();
    }
  }

  async getViews(connectionId: string, ownerId: string) {
    const connection = await this.connectionRepository.findByIdAndOwner(connectionId, ownerId);

    if (!connection) {
      throw new Error("Connection not found");
    }

    const connector = ConnectorFactory.create(
      connection.databaseType,
      decrypt(connection.encryptedUrl)
    );

    await connector.connect();

    try {
      const tableReader = TableReaderFactory.create(connection.databaseType, connector.getClient());
      return await tableReader.getViews();
    } finally {
      await connector.disconnect();
    }
  }

  async getFunctions(connectionId: string, ownerId: string) {
    const connection = await this.connectionRepository.findByIdAndOwner(connectionId, ownerId);

    if (!connection) {
      throw new Error("Connection not found");
    }

    const connector = ConnectorFactory.create(
      connection.databaseType,
      decrypt(connection.encryptedUrl)
    );

    await connector.connect();

    try {
      const tableReader = TableReaderFactory.create(connection.databaseType, connector.getClient());
      return await tableReader.getFunctions();
    } finally {
      await connector.disconnect();
    }
  }

  async getDatabaseInfo(connectionId: string, ownerId: string) {
    const connection = await this.connectionRepository.findByIdAndOwner(connectionId, ownerId);

    if (!connection) {
      throw new Error("Connection not found");
    }

    const connector = ConnectorFactory.create(
      connection.databaseType,
      decrypt(connection.encryptedUrl)
    );

    await connector.connect();

    try {
      const tableReader = TableReaderFactory.create(connection.databaseType, connector.getClient());
      return await tableReader.getDatabaseInfo();
    } finally {
      await connector.disconnect();
    }
  }

  async getSchemas(connectionId: string, ownerId: string) {
    const connection = await this.connectionRepository.findByIdAndOwner(connectionId, ownerId);

    if (!connection) {
      throw new Error("Connection not found");
    }

    const connector = ConnectorFactory.create(
      connection.databaseType,
      decrypt(connection.encryptedUrl)
    );

    await connector.connect();

    try {
      const tableReader = TableReaderFactory.create(connection.databaseType, connector.getClient());
      return await tableReader.getSchemas();
    } finally {
      await connector.disconnect();
    }
  }

  async executeQuery(connectionId: string, ownerId: string, query: string) {
    const connection = await this.connectionRepository.findByIdAndOwner(connectionId, ownerId);

    if (!connection) {
      throw new Error("Connection not found");
    }

    const connector = ConnectorFactory.create(
      connection.databaseType,
      decrypt(connection.encryptedUrl)
    );

    await connector.connect();

    try {
      return await connector.executeQuery(query);
    } finally {
      await connector.disconnect();
    }
  }
}
