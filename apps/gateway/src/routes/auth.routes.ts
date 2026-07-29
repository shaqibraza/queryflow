import { Router } from "express";
import { fixRequestBody, createProxyMiddleware } from "http-proxy-middleware";

const router = Router();

router.use(
  "/",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path) => `/auth${path}`,
    on: {
      proxyReq: fixRequestBody
    }
  })
);

export default router;
