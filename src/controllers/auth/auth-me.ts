import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../lib/prisma";

export default async function AuthMeController(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const { sub } = req.user;

  const user = await prisma.user.findUnique({
    where: {
      id: sub,
    },
  });

  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  return res.send({ user });
}
