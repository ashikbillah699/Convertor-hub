import "dotenv/config";

export const config = {
  port: Number(process.env.PORT || 3001),
  mongoUri: process.env.MONGODB_URI || "",
  adminUsername: process.env.ADMIN_USERNAME || "",
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH || "",
  sessionSecret: process.env.SESSION_SECRET || "",
  nodeEnv: process.env.NODE_ENV || "development",
};

export const validateConfig = () => {
  const missing = [
    ["MONGODB_URI", config.mongoUri],
    ["ADMIN_USERNAME", config.adminUsername],
    ["ADMIN_PASSWORD_HASH", config.adminPasswordHash],
    ["SESSION_SECRET", config.sessionSecret],
  ].filter(([, value]) => !value).map(([key]) => key);

  if (missing.length) {
    throw new Error(`Missing required server environment variables: ${missing.join(", ")}`);
  }

  if (config.sessionSecret.length < 32) {
    throw new Error("SESSION_SECRET must be at least 32 characters long.");
  }

  if (!Number.isInteger(config.port) || config.port < 1 || config.port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535.");
  }
};
