import { z } from "zod";

export const PRSchema = z.object({
  prUrl: z.string().url(),
});

export type PR = z.infer<typeof PRSchema>;
