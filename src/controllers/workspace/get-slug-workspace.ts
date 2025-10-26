import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";

export default async function GetSlugWorkspaceController(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const { slug } = req.params as { slug: string };
  const user = req.user;

  console.log(user.sub);

  const workspace = await prisma.workspace.findUnique({
    where: {
      slug,
    },
    include: {
      memberships: true,
      pages: true,
    },
  });

  if (!workspace) {
    return res.status(404).send({ error: "Workspace not found" });
  }

  return res.send(workspace);
}
