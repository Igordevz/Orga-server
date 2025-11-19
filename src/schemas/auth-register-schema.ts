import { z } from "zod";

export const authRegisterSchema = z.object({
  name: z.string().min(2).max(100),
  password: z.string().min(8).max(100),
  email: z.string().email(),
});
