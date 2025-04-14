"use server";
import { z } from "zod";
import { categorySchema } from "../schemas/category";
import { getCurrentUser } from "@/services/clerk";
import { canCreateCategory, canUpdateCategory } from "../permissions/category";

import {
  insertCategory,
  updateCategory as updatedCategoryDb,
} from "../db/category";

export async function createCategory(
  unsafeData: z.infer<typeof categorySchema>
) {
  const { success, data } = categorySchema.safeParse(unsafeData);
  console.log(data);
  if (!success || !canCreateCategory(await getCurrentUser())) {
    return { error: true, message: "There was an error creating your product" };
  }
  await insertCategory(data);
  return { success: true, message: "Category created successfully" };
}

export async function updateCategory(
  id: number,
  unsafeData: z.infer<typeof categorySchema>
) {
  const { success, data } = categorySchema.safeParse(unsafeData);

  if (!success || !canUpdateCategory(await getCurrentUser())) {
    return { error: true, message: "There was an error updating your product" };
  }
  await updatedCategoryDb(id, data);
  return { success: true, message: "Product updated successfully" };
}
