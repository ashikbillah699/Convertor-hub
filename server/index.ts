import express, { type ErrorRequestHandler } from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { config, validateConfig } from "./config";
import { connectDatabase } from "./db";
import { adminRouter, apiRouter, isBadRequestError, isDuplicateKeyError, isValidationError } from "./routes";

const start = async () => {
  validateConfig();
  await connectDatabase();

  const app = express();
  app.disable("x-powered-by");
  app.use(helmet());
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());
  app.use("/api", apiRouter);
  app.use("/api/admin", adminRouter);

  const errors: ErrorRequestHandler = (error, _request, response, _next) => {
    if (isValidationError(error)) {
      response.status(400).json({ error: error instanceof Error ? error.message : "Invalid request data." });
      return;
    }
    if (isBadRequestError(error)) {
      response.status(400).json({ error: "Request body must contain valid JSON." });
      return;
    }
    if (isDuplicateKeyError(error)) {
      response.status(409).json({ error: "A content item with that ID or slug already exists." });
      return;
    }
    console.error("API request failed:", error);
    response.status(500).json({ error: "The request could not be completed." });
  };
  app.use(errors);

  app.listen(config.port, "127.0.0.1", () => {
    console.log(`Local content API listening at http://localhost:${config.port}`);
  });
};

start().catch((error: unknown) => {
  console.error("Unable to start the content API:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
