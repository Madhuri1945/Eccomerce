import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.preprocess(
    (val) => parseFloat(val as string),
    z.number().positive("Price must be a positive number")
  ),
  stock: z.preprocess(
    (val) => parseInt(val as string, 10),
    z.number().nonnegative("Stock must be a non-negative integer")
  ),
  image: z.string().url("Invalid image URL"),
  categoryId: z.number().int(),
});
