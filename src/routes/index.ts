import type { FastifyInstance } from "fastify";
import userRouter from "./user";
import { workSpaceRouter } from "./workspace";
import { routerPages } from "./page";

export default function RouterIndex(app: FastifyInstance) {
  const router = app;

  router.register(userRouter);
  router.register(workSpaceRouter);
  router.register(routerPages);

  router.get("/", () => {
    return "Hello World!";
  });
}
