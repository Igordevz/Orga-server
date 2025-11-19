import { z } from "zod";

export const authEmailSchema = z.object({
  email: z.string().email({ message: "Endereço de e-mail inválido" }),
  password: z.string(),
});
