export interface Executor<TResult = unknown> {
  execute(query: string): Promise<TResult>;
}
