import type { FastifyInstance } from "fastify/types/instance";
import { validateToken } from "../middlewares/validate-jwt";
import NewWorkspaceController from "../controllers/workspace/new-workspace";

export async function workSpaceRouter(app: FastifyInstance) {
  app.post(
    "/workspace",
    { preHandler: [validateToken] },
    NewWorkspaceController,
  );
}
