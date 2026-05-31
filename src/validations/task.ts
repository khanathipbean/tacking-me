import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Task title is required").max(200),
  description: z.string().max(1000).nullable(),
  status: z.enum(["DRAFT", "IN_PROGRESS", "DONE", "CANCEL"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  project_id: z.string().uuid(),
  category_id: z.string().uuid().nullable(),
  start_date: z.string().nullable(),
  end_date: z.string().nullable(),
}).refine(
  (data) => {
    if (data.start_date && data.end_date) {
      return new Date(data.end_date) >= new Date(data.start_date);
    }
    return true;
  },
  { message: "End date must be after start date", path: ["end_date"] }
);

export type TaskFormValues = z.infer<typeof taskSchema>;
