import { z } from "zod";

export const PRSchema = z.object({
  prUrl: z.string().url(),
});

export type PR = z.infer<typeof PRSchema>;

export const searchFile = z.object({
  query: z.string().min(1, "File name is required"),
});

export type SearchFile = z.infer<typeof searchFile>;
