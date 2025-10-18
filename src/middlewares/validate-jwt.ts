import type { FastifyRequest } from "fastify";
import { env } from "../variables/env";
import jwt from "jsonwebtoken";

export const validateToken = async (req: FastifyRequest) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    throw new Error("No token provided");
  }

  try {
    const decoded = jwt.verify(token, env.JWT_KEY!);

    if (typeof decoded === "object" && decoded.sub) {
      req.user = { sub: decoded.sub };
    } else {
      throw new Error("Invalid token");
    }
  } catch (error) {
    throw new Error("Invalid token");
  }
};
