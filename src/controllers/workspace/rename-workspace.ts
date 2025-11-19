import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { db } from "../../db";
import { workspaces } from "../../db/schema";
import { eq } from "drizzle-orm";
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

  const [workspace] = await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.slug, slug));

  if (!workspace) {
    return res.status(404).send({ error: "Workspace não encontrado" });
  }

  if (workspace.ownerId !== sub) {
    return res
      .status(403)
      .send({ error: "Você não é o proprietário deste workspace" });
  }

  let newSlug = slugify(name);
  let [existingWorkspace] = await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.slug, newSlug));

  while (existingWorkspace && existingWorkspace.id !== workspace.id) {
    newSlug = `${slugify(name)}-${Math.random().toString(36).substring(2, 7)}`;
    [existingWorkspace] = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.slug, newSlug));
  }

  const [updatedWorkspace] = await db
    .update(workspaces)
    .set({
      name,
      slug: newSlug,
    })
    .where(eq(workspaces.slug, slug))
    .returning();

  return res.send({
    workspace: updatedWorkspace,
    message: "Workspace renomeado com sucesso!",
  });
}
