import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import { createIntakeResponse, getIntakeResponse, type IntakePayload } from "./db.js";

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(
  cors({
    origin: "http://localhost:5173"
  })
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/intake", async (req, res, next) => {
  try {
    const response = await createIntakeResponse(req.body as IntakePayload);

    if (!response) {
      res.status(400).json({ error: "fullName is required" });
      return;
    }

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

app.get("/api/intake/:id", async (req, res, next) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: "id must be a positive integer" });
    return;
  }

  try {
    const response = await getIntakeResponse(id);

    if (!response) {
      res.status(404).json({ error: "intake response not found" });
      return;
    }

    res.json(response);
  } catch (error) {
    next(error);
  }
});

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: "internal server error" });
};

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Intake API server listening on http://localhost:${port}`);
});
