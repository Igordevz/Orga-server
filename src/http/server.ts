import fastify from "fastify";
import { env } from "../variables/env";
import fastifyCors from "@fastify/cors";
import RouterIndex from "../routes";
import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";

const app = fastify({
  logger: false,
});

const PORT = 3333;

app.register(fastifyJwt, {
  secret: env.JWT_KEY,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
  sign: {
    expiresIn: "7d",
  },
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
