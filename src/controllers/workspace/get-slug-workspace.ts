import type { FastifyReply, FastifyRequest } from "fastify";
import { db } from "../../db";
import { workspaces } from "../../db/schema";
import { eq } from "drizzle-orm";

export default async function GetSlugWorkspaceController(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const { slug } = req.params as { slug: string };
  const user = req.user;

  const workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.slug, slug),
    with: {
      memberships: true,
      pages: true,
    },
  });

  if (!workspace) {
    return res.status(404).send({ error: "Workspace not found" });
  }

  return res.send(workspace);
}
