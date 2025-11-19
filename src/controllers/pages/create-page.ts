import { v4 as uuidv4 } from "uuid";
import type { FastifyRequest } from "fastify";
import z from "zod";
import { db } from "../../db";
import { pages } from "../../db/schema";

export default async function createPagetoWork(req: FastifyRequest) {
  const schemaPage = z.object({
    title: z.string().min(1, "você precisa inserir um título"),
    icon: z.string().min(1, "você precisa inserir um ícone"),
    coverImage: z.string().optional(),
    data: z.string(),
    workspaceId: z.string(),
  });

  const { title, icon, coverImage, data, workspaceId } = schemaPage.parse(
    req.body,
  );

  const [createpage] = await db
    .insert(pages)
    .values({
      id: uuidv4(),
      title,
      icon,
      coverImage,
      data,
      workspaceId,
    })
    .returning();

  if (!createpage) {
    throw new Error("Erro ao criar página");
  }

  return {
    status: "success",
    data: createpage,
  };
}
