import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";

import { slugify } from "../../lib/slugify";

export default async function NewWorkspaceController(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const workSpaceSchema = z.object({
    name: z.string().min(2).max(100),
  });

  const { name } = workSpaceSchema.parse(req.body);
  const { sub } = req.user as { sub: string };

  let slug = slugify(name);
  let workspace = await prisma.workspace.findUnique({
    where: { slug },
  });

  while (workspace) {
    slug = `${slugify(name)}-${Math.random().toString(36).substring(2, 7)}`;
    workspace = await prisma.workspace.findUnique({
      where: { slug },
    });
  }

  const newWorkSpace = await prisma.workspace.create({
    data: {
      ownerId: sub,
      slug,
      name,
    },
  });

  return res
    .status(201)
    .send({
      workspace: newWorkSpace,
      message: "workspace criada com sucesso!",
    });
}
