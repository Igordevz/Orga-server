import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";

export default async function NewWorkspaceController(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const workSpaceSchema = z.object({
    name: z.string().min(2).max(100),
  });

  const { name } = workSpaceSchema.parse(req.body);

  const newWorkSpace = await prisma.workspace.create({
    data: {
      name,
    },
  });
}
