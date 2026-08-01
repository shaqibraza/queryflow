import { Executor } from "../interfaces/executor.js";

export class MongoDbExecutor implements Executor {
  async execute(): Promise<never> {
    throw new Error("MongoDB executor is not implemented yet.");
  }
}
