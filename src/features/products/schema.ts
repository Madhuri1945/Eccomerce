import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be a positive number"),
  stock: z.number().min(0, "Stock must be a positive number"),
  image: z.string().url("Image must be a valid URL"),
  categoryId: z.number(),
  subCategoryId: z.number().optional(),
  subCategoryName: z.string().optional(), // Add this line
});

export const subCategorySchema = z.object({
  name: z.string().min(1, "Subcategory name is required"), // Name is mandatory
  categoryId: z.number().int("Category ID must be an integer"), // Validates associated category ID
});
