import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { config } from "./config";

const cookieName = "opticthirst_admin";
const cookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: config.nodeEnv === "production",
  path: "/api/admin",
  maxAge: 8 * 60 * 60 * 1000,
};

export const verifyAdminPassword = (username: string, password: string) =>
  username === config.adminUsername && bcrypt.compare(password, config.adminPasswordHash);

export const createAdminSession = (response: Response) => {
  const token = jwt.sign({ sub: config.adminUsername, role: "admin" }, config.sessionSecret, {
    expiresIn: "8h",
    issuer: "opticthirst-local-admin",
  });
  response.cookie(cookieName, token, cookieOptions);
};

export const clearAdminSession = (response: Response) => {
  response.clearCookie(cookieName, {
    httpOnly: true,
    sameSite: "strict",
    secure: config.nodeEnv === "production",
    path: "/api/admin",
  });
};

export const requireAdmin = (request: Request, response: Response, next: NextFunction) => {
  const token = request.cookies?.[cookieName];
  if (!token) {
    response.status(401).json({ error: "Admin authentication is required." });
    return;
  }

  try {
    const payload = jwt.verify(token, config.sessionSecret, {
      issuer: "opticthirst-local-admin",
    });
    if (typeof payload === "string" || payload.sub !== config.adminUsername || payload.role !== "admin") {
      response.status(401).json({ error: "Admin session is invalid." });
      return;
    }
    next();
  } catch {
    response.status(401).json({ error: "Admin session has expired. Please sign in again." });
  }
};
