import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import AllRoutes from "./routes/AllRoutes.routes.js";
import { startCron } from "./cron/Strategy.js";

const app = express();

// CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api", AllRoutes);

// Start ETF strategy cron
startCron();

export default app;
