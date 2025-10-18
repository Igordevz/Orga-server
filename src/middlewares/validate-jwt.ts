import type { FastifyRequest } from "fastify";
import { env } from "../variables/env";
import jwt from "jsonwebtoken";

export const validateToken = async (req: FastifyRequest) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    throw new Error("Nenhum token fornecido");
  }

  try {
    const decoded = jwt.verify(token, env.JWT_KEY!);

    if (typeof decoded === "object" && decoded.sub) {
      req.user = { sub: decoded.sub };
    } else {
      throw new Error("Token inválido");
    }
  } catch (error) {
    throw new Error("Token inválido");
  }
};
