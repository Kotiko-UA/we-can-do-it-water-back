import express from "express";
import logger from "morgan";
import cors from "cors";
import waterNotesRouter from "./routes/api/water-notes-router.js";
import "dotenv/config";
import authRouter from "./routes/api/auth-router.js";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
const swaggerDocument = JSON.parse(fs.readFileSync("./swagger.json"));

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/waternotes", waterNotesRouter);

app.use("/api/users", authRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((error, req, res, next) => {
  const { status = 500, message = "Server error" } = error;
  res.status(status).json({ message });
});
export default app;
