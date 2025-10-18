import type { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../variables/env";

export default async function AuthRegisterController(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const userSchema = z.object({
    name: z.string().min(2).max(100),
    password: z.string().min(8).max(100),
    email: z.email(),
  });

  const { name, password, email } = await userSchema.parseAsync(req.body);

  const validateEmailExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  const saltHash = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, saltHash);

  if (validateEmailExist) {
    return res.status(400).send({ message: "E-mail já cadastrado" });
  }

  const user = await prisma.user.create({
    data: {
      name,
      password: hashedPassword,
      email,
    },
  });

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
    .status(201)
    .send({ message: "Usuário criado com sucesso" });
}
