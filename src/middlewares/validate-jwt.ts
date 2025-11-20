import type { FastifyReply, FastifyRequest } from "fastify";
import { env } from "../variables/env";
import jwt from "jsonwebtoken";

export const validateToken = async (req: FastifyRequest, rep: FastifyReply) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    throw new Error("Nenhum token fornecido");
  }

  try {
    const decoded = jwt.verify(token, env.JWT_KEY!);

    if (typeof decoded === "object" && decoded.sub) {
      req.user = { sub: decoded.sub };
    } else {
      rep
        .clearCookie("refreshToken")
        .send({
          error: "redirect",
        })
        .status(401);
      throw new Error("Token inválido");
    }
  } catch (error) {
    rep
      .clearCookie("refreshToken")
      .send({
        error: "redirect",
      })
      .status(401);
    throw new Error("Token inválido");
  }
};
