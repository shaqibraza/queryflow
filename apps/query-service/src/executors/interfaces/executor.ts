export interface Executor<TQuery = unknown, TResult = unknown> {
  execute(query: TQuery): Promise<TResult>;
}
