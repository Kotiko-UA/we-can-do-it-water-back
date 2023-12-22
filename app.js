import express from "express";
import logger from "morgan";
import cors from "cors";
import waterNotesRouter from "./routes/api/water-notes-router.js";
import "dotenv/config";
import authRouter from "./routes/api/auth-router.js";

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send(
    `<h1>Home page</h1><a href="/">Home</a> <a href="/waterNotes">waterNotes</a>`
  );
});
app.get("/waterNotes", (req, res) => {
  res.send(
    `<h1>waterNotes</h1>
    <a href="/">Home</a> <a href="/waterNotes">waterNotes</a>
    <div><img src="/avatars/1701561126762_420970656}_Screenshot from 2023-08-18 17-58-21.png"></div>
    `
  );
});

app.use("/api/waterNotes", waterNotesRouter);

app.use("/api/users", authRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((error, req, res, next) => {
  const { status = 500, message = "Server error" } = error;
  res.status(status).json({ message });
});
export default app;