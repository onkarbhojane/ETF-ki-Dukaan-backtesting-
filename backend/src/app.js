import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import AllRoutes from "./routes/AllRoutes.routes.js";
// import { getETFData } from "./cron/ETF_ki_Dukan_Job";
import { startCron } from "./cron/Strategy.js";
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
// app.use(morgan("dev"));
app.use(cookieParser());

startCron(); 

app.use("/api",AllRoutes);

export default app;