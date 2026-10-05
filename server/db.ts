import mongoose from "mongoose";
import { config } from "./config";

export const connectDatabase = async () => {
  mongoose.set("bufferCommands", false);
  await mongoose.connect(config.mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });
};

export const databaseReady = () => mongoose.connection.readyState === 1;
