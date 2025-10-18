import type { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";

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
    return res.status(400).send({ message: "Email already exists" });
  }

  const user = await prisma.user.create({
    data: {
      name,
      password: hashedPassword,
      email,
    },
  });

  const token = await res.jwtSign({
    sub: user.id,
  });

  return res
    .setCookie("refreshToken", token, {
      path: "/",
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(201)
    .send({ message: "User created successfully" });
}
