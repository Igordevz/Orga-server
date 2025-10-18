import type { FastifyInstance } from "fastify";
import userRouter from "./user";

export default function RouterIndex(app: FastifyInstance) {
  const router = app;

  router.register(userRouter);
  router.get("/", () => {
    return "Hello World!";
  });
}
