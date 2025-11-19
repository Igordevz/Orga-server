import { v4 as uuidv4 } from "uuid";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { db } from "../../db";
import { workspaces } from "../../db/schema";
import { eq } from "drizzle-orm";

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
  let [workspace] = await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.slug, slug));

  while (workspace) {
    slug = `${slugify(name)}-${Math.random().toString(36).substring(2, 7)}`;
    [workspace] = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.slug, slug));
  }

  const [newWorkSpace] = await db
    .insert(workspaces)
    .values({
      id: uuidv4(),
      ownerId: sub,
      slug,
      name,
    })
    .returning();

  return res.status(201).send({
    workspace: newWorkSpace,
    message: "workspace criada com sucesso!",
  });
}
