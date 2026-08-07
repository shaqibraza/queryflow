import type { HealthResponse } from "@queryflow/types";
import { createTimestamp } from "@queryflow/utils";

export class HealthService {
  constructor(private readonly serviceName: string) {}

  getHealth(): HealthResponse {
    return {
      service: this.serviceName,
      status: "ok",
      timestamp: createTimestamp()
    };
  }
}
