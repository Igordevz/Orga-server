
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { slugify } from "../../lib/slugify";

export default async function RenameWorkspaceController(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const { slug } = req.params as { slug: string };
  const { sub } = req.user;

  const renameWorkspaceSchema = z.object({
    name: z.string().min(2).max(100),
  });

  const { name } = renameWorkspaceSchema.parse(req.body);

  const workspace = await prisma.workspace.findUnique({
    where: {
      slug,
    },
  });

  if (!workspace) {
    return res.status(404).send({ error: "Workspace não encontrado" });
  }

  if (workspace.ownerId !== sub) {
    return res.status(403).send({ error: "Você não é o proprietário deste workspace" });
  }

  let newSlug = slugify(name);
  let existingWorkspace = await prisma.workspace.findUnique({
    where: { slug: newSlug },
  });

  while (existingWorkspace && existingWorkspace.id !== workspace.id) {
    newSlug = `${slugify(name)}-${Math.random().toString(36).substring(2, 7)}`;
    existingWorkspace = await prisma.workspace.findUnique({
      where: { slug: newSlug },
    });
  }

  const updatedWorkspace = await prisma.workspace.update({
    where: {
      slug,
    },
    data: {
      name,
      slug: newSlug,
    },
  });

  return res.send({
    workspace: updatedWorkspace,
    message: "Workspace renomeado com sucesso!",
  });
}
