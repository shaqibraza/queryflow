import { queryApi } from "./api";

export interface DatabaseMetadata {
  databaseInfo: {
    database: string;
    version: string;
    size: string;
  };

  schemas: string[];

  tables: {
    schema: string;
    name: string;
    type: string;
  }[];

  columns: Record<
    string,
    {
      name: string;
      type: string;
      nullable: boolean;
      default: string | null;
    }[]
  >;

  primaryKeys: Record<string, string[]>;

  relations: {
    fromTable: string;
    fromColumn: string;
    toTable: string;
    toColumn: string;
  }[];

  indexes: {
    table: string;
    index: string;
    unique: boolean;
  }[];

  views: any[];

  functions: any[];
}

export class MetadataService {
  static async getMetadata(connectionId: string) {
    const url = `/metadata/${connectionId}`;

    const { data } = await queryApi.get(url);

    return data.data;
  }
}
