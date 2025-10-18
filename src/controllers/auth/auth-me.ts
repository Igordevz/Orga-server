import type { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../lib/prisma";
import z from "zod";

export default async function AuthMeController(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const { sub } = req.user as { sub: string };

  const user = await prisma.user.findUnique({
    where: {
      id: sub,
    },
  });

  if (!user) {
    return res.status(404).send({ message: "Usuário não encontrado" });
  }

  return res.send({ user });
}
