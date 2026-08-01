import { Request, Response, NextFunction } from "express";

import { QueryService } from "../services/query.service.js";
import { querySchema } from "../validators/query.validator.js";

export class QueryController {
  constructor(private readonly queryService: QueryService) {}

  query = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = querySchema.parse(req.body);
      const userId = req.header("x-user-id");
      if (!userId || typeof userId !== "string") {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const result = await this.queryService.processQuery(body.connectionId, body.question, userId);

      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };
}
