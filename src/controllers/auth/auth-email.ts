import type { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../variables/env";

export default async function AuthEmailController(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const userSchema = z.object({
    email: z.email({ message: "Endereço de e-mail inválido" }),
    password: z.string(),
  });

  const result = userSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).send({ errors: result.error.flatten().fieldErrors });
  }

  const { email, password } = result.data;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(404).send({ message: "Usuário não encontrado" });
  }

  if (!user.password) {
    return res
      .status(400)
      .send({ message: "Por favor, faça login com o Github" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).send({ message: "Senha incorreta" });
  }

  const token = jwt.sign({ sub: user.id }, env.JWT_KEY, {
    expiresIn: "7d",
  });

  return res
    .setCookie("refreshToken", token, {
      path: "/",
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .send({ token });
}
