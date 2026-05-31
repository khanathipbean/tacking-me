import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100),
  description: z.string().max(500).nullable(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid color format"),
  status: z.enum(["ACTIVE", "ARCHIVED"]),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
