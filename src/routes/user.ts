import type { FastifyInstance } from "fastify";
import AuthRegisterController from "../controllers/auth/auth-register";
import AuthGithubController from "../controllers/auth/auth-github";
import AuthMeController from "../controllers/auth/auth-me";
import { validateToken } from "../middlewares/validate-jwt";
import AuthEmailController from "../controllers/auth/auth-email";

export default async function userRouter(app: FastifyInstance) {
  app.post("/auth/register", AuthRegisterController);
  app.post("/auth/login", AuthEmailController);
  app.get("/auth/github/callback", AuthGithubController);

  app.get("/user", { preHandler: [validateToken] }, AuthMeController);
}
