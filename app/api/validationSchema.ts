import { z } from "zod";

export const commentSchema = z.object({
  content: z.string().min(1, "This field is required").max(65355),
  parentId: z.string().optional(),
});
