import type { FastifyInstance } from "fastify";
import createPagetoWork from "../controllers/pages/create-page";

export async function routerPages(app: FastifyInstance) {
  app.post("/page", createPagetoWork);
}
