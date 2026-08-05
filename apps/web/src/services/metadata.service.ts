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
    console.log("BASE URL:", queryApi.defaults.baseURL);

    const url = `/metadata/${connectionId}`;

    console.log("URL:", url);

    console.log("FINAL URL:", `${queryApi.defaults.baseURL}${url}`);

    const { data } = await queryApi.get(url);

    return data.data;
  }
}
