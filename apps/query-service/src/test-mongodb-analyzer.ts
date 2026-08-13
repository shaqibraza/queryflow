import { MongoDbAnalyzer } from "./query-analyzer/mongodb/mongodb-analyzer.js";
import type { MongoCommand } from "@queryflow/shared";

const analyzer = new MongoDbAnalyzer();

const queries: MongoCommand[] = [
  {
    collection: "users",
    operation: "find",
    filter: {}
  },
  {
    collection: "users",
    operation: "findOne",
    filter: {
      _id: 1
    }
  },
  {
    collection: "users",
    operation: "aggregate",
    pipeline: []
  },
  {
    collection: "users",
    operation: "insertOne",
    document: {
      name: "Shaqib"
    }
  },
  {
    collection: "users",
    operation: "updateOne",
    filter: {},
    update: {
      $set: {
        name: "Ali"
      }
    }
  },
  {
    collection: "users",
    operation: "deleteMany",
    filter: {}
  },
  {
    collection: "users",
    operation: "drop"
  }
];
