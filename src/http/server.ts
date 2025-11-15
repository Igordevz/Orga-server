import fastify from "fastify";
import { env } from "../variables/env";
import RouterIndex from "../routes";
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";

const app = fastify({
  logger: false,
});

app.register(fastifyCookie);

app.register(fastifyCors, {
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
});

app.register(RouterIndex);
async function start() {
  try {
    await app.listen({ port: parseInt(env.PORT) || 3333 });
    console.log("🦊 http server running: ", env.PORT);
  } catch (err) {
    console.log(err);
  }
}
start();
