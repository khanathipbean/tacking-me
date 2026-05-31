import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(100),
  description: z.string().max(500).nullable(),
  project_id: z.string().uuid(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
