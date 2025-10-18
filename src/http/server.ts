import fastify from "fastify";
import { env } from "../variables/env";
import RouterIndex from "../routes";
import fastifyCookie from "@fastify/cookie";

const app = fastify({
  logger: false,
});

app.register(fastifyCookie);

app.register(RouterIndex);
async function start() {
  try {
    await app.listen({ port: parseInt(env.PORT) || 3333 });
    console.log("http server running: ", env.PORT);
  } catch (err) {
    console.log(err);
  }
}
start();
