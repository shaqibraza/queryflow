import type { DataSourceType } from "@queryflow/types";

export type PromptTemplateContext = {
  sourceType: DataSourceType;
  schemaDescription: string;
  question: string;
};

export type PromptTemplate = (context: PromptTemplateContext) => string;

export const promptTemplateRegistry = new Map<DataSourceType, PromptTemplate>();
