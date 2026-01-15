import { Request } from "express";
import { verifyToken } from "./auth";

export const getUserFromRequest = (req: Request) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return null;
  const token = authHeader.replace("Bearer ", "");

  const user = verifyToken(token);
  return user || null;
};
