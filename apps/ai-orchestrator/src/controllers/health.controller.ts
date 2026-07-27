import type { Request, Response } from "express";
import type { HealthService } from "../services/health.service.js";

export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  show = (_request: Request, response: Response): void => {
    response.status(200).json(this.healthService.getHealth());
  };
}
