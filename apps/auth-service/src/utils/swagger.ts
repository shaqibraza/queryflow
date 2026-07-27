import swaggerJSDoc from "swagger-jsdoc";
import type { Options } from "swagger-jsdoc";

const options: Options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "QueryFlow Auth Service API",
      version: "0.1.0"
    }
  },
  apis: ["src/routes/**/*.ts"]
};

export const swaggerSpec = swaggerJSDoc(options);
