import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.route.ts";
import moviesRoutes from "./routes/movies.route.ts";
// import { PrismaClient } from "@prisma/client";

import multer from "multer";

const upload = multer();

// const prisma = new PrismaClient();

const app = express();

dotenv.config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(cors({ origin: "*", credentials: true }));

app.use(upload.none());
app.use("/api/auth", authRoutes);
app.use("/api/show", moviesRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log("server work on ", port);
});
