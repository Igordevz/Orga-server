import { v4 as uuidv4 } from "uuid";
import type { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../variables/env";

import { authRegisterSchema } from "../../schemas/auth-register-schema";

export default async function AuthRegisterController(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const { name, password, email } = await authRegisterSchema.parseAsync(
    req.body,
  );

  const [validateEmailExist] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  const saltHash = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, saltHash);

  if (validateEmailExist) {
    return res.status(400).send({ message: "E-mail já cadastrado" });
  }

  const [user] = await db
    .insert(users)
    .values({
      id: uuidv4(),
      name,
      password: hashedPassword,
      email,
    })
    .returning();

  if (!user) {
    throw new Error("Failed to create user.");
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
    .status(201)
    .send({ message: "Usuário criado com sucesso" });
}
