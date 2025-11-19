import type { FastifyRequest, FastifyReply } from "fastify";
import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import z from "zod";

export default async function AuthMeController(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const { sub } = req.user as { sub: string };

  const user = await db.query.users.findFirst({
    where: eq(users.id, sub),
    with: {
      workspaces: {
        with: {
          pages: true,
        },
      },
      favoritePages: true,
      memberships: true,
    },
  });

  if (!user) {
    return res.status(404).send({ message: "Usuário não encontrado" });
  }

  return res.send({ user });
}
