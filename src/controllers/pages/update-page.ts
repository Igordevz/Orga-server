import type { FastifyRequest } from "fastify";
import z from "zod";
import { db } from "../../db";
import { pages } from "../../db/schema";
import { eq } from "drizzle-orm";

export default async function updatePage(req: FastifyRequest) {
  const schemaPage = z.object({
    id: z.string(),
    title: z.string().min(1, "você precisa inserir um título").optional(),
    icon: z.string().min(1, "você precisa inserir um ícone").optional(),
    coverImage: z.string().optional(),
    data: z.string().optional(),
    workspaceId: z.string().optional(),
  });

  const { id, title, icon, coverImage, data, workspaceId } = schemaPage.parse(
    req.body,
  );

  const [updatedPage] = await db
    .update(pages)
    .set({
      title,
      icon,
      coverImage,
      data,
      workspaceId,
      updatedAt: new Date(),
    })
    .where(eq(pages.id, id))
    .returning();

  if (!updatedPage) {
    throw new Error("Erro ao atualizar página ou página não encontrada");
  }

  return {
    status: "success",
    data: updatedPage,
  };
}
