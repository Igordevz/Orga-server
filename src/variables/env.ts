import { z } from "zod";

export const env = z
  .object({
    PORT: z.string().min(1).max(5),
    JWT_KEY: z.string().min(1),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    HOST_WEB: z.string().url(),
  })
  .parse(process.env);
