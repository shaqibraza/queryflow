import type { HealthResponse } from "@queryflow/types";

export type ApiClientOptions = {
  baseUrl: string;
  fetcher?: typeof fetch;
};

export class ApiClient {
  private readonly baseUrl: string;
  private readonly fetcher: typeof fetch;

  constructor(options: ApiClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, "");
    this.fetcher = options.fetcher ?? fetch;
  }

  async health(): Promise<HealthResponse> {
    const response = await this.fetcher(`${this.baseUrl}/health`);

    if (!response.ok) {
      throw new Error(`Health request failed with status ${response.status}`);
    }

    return response.json() as Promise<HealthResponse>;
  }
}
