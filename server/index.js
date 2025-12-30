import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 6001;

// Middleware setup
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cors());

// MongoDB connection
// Implement Later when I get the API key

// Basic route
app.get("/", (req, res) => {
  res.send("Hello, World!");
}); 