import type { FastifyInstance } from "fastify";
import createPagetoWork from "../controllers/pages/create-page";
import updatePage from "../controllers/pages/update-page";

export async function routerPages(app: FastifyInstance) {
  app.post("/page", createPagetoWork);
  app.patch("/page", updatePage);
}
