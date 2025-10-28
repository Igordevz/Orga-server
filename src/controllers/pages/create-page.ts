import type { FastifyRequest } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";

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

  const createpage = await prisma.page.create({
    data: {
      title,
      icon,
      coverImage,
      data,
      workspaceId,
    },
  });

  if (!createpage) {
    throw new Error("Erro ao criar página");
  }

  return {
    status: "success",
    data: createpage,
  };
}
