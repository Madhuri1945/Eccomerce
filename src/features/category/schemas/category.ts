import { z } from "zod";
export const categorySchema = z.object({
  id: z.number().optional(), // Make `id` optional for creating new categories
  name: z.string().min(1, "Name is required"),
  image: z.string().url("Image must be a valid URL"),
});
