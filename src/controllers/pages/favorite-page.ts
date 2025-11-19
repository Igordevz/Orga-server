import type { FastifyRequest } from "fastify";
import z from "zod";
import { db } from "../../db";
import { favoritePages } from "../../db/schema";
import { eq } from "drizzle-orm";

export default async function FavoritePage(req: FastifyRequest) {
  const schemaPage = z.object({
    id: z.string(),
  });

  const { id } = schemaPage.parse(req.body);

  const [favorite] = await db
    .select()
    .from(favoritePages)
    .where(eq(favoritePages.id, id));

  return favorite;
}
