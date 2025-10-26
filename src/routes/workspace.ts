import type { FastifyInstance } from "fastify/types/instance";
import { validateToken } from "../middlewares/validate-jwt";
import NewWorkspaceController from "../controllers/workspace/new-workspace";
import GetSlugWorkspaceController from "../controllers/workspace/get-slug-workspace";
import RenameWorkspaceController from "../controllers/workspace/rename-workspace";

export async function workSpaceRouter(app: FastifyInstance) {
  app.post(
    "/workspace",
    { preHandler: [validateToken] },
    NewWorkspaceController,
  );

  app.get(
    "/:slug",
    { preHandler: [validateToken] },
    GetSlugWorkspaceController,
  );

  app.put(
    "/:slug",
    { preHandler: [validateToken] },
    RenameWorkspaceController,
  );
}
