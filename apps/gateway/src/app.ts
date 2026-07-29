import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import { authenticate } from "./middleware/authenticate.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);

app.get("/api/profile", authenticate, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Gateway is running"
  });
});

const PORT = process.env.GATEWAY_PORT || 4000;

app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
});

export default app;
