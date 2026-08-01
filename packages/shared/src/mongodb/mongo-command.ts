export interface MongoCommand {
  collection: string;

  operation:
    | "find"
    | "findOne"
    | "countDocuments"
    | "aggregate"
    | "distinct"
    | "insertOne"
    | "updateOne"
    | "updateMany"
    | "replaceOne"
    | "deleteOne"
    | "deleteMany"
    | "drop";

  filter?: Record<string, unknown>;

  projection?: Record<string, unknown>;

  sort?: Record<string, 1 | -1>;

  limit?: number;

  skip?: number;

  pipeline?: Record<string, unknown>[];

  document?: Record<string, unknown>;

  documents?: Record<string, unknown>[];

  update?: Record<string, unknown>;

  replacement?: Record<string, unknown>;

  field?: string;
}
