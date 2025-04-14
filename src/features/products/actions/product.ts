"use server";

import { productSchema } from "../schema";
import { z } from "zod";
import {
  canCreateProduct,
  canDeleteProduct,
  canUpdateProduct,
} from "../permissions/product";
import { getCurrentUser } from "@/services/clerk";
import {
  insertProduct,
  updateProduct as updateProductDb,
  deleteProduct as deleteProductDb,
} from "../db/product";
import { redirect } from "next/navigation";
import { revalidateCategoryCache } from "@/features/category/db/cache";

export async function createProduct(unsafeData: z.infer<typeof productSchema>) {
  const { success, data } = productSchema.safeParse(unsafeData);

  if (!success) {
    return { error: true, message: "Invalid product data" };
  }

  const user = await getCurrentUser();
  if (!canCreateProduct(user)) {
    return { error: true, message: "Permission denied" };
  }

  // Ensure description is a string, default to empty string if undefined
  const processedData = { ...data, description: data.description || "" };

  const result = await insertProduct(processedData);

  if (result?.error) {
    return { error: true, message: result.message };
  }

  return { success: true, message: "Product created successfully" };
}

export async function updateProduct(
  id: number,
  unsafeData: z.infer<typeof productSchema>
) {
  const { success, data } = productSchema.safeParse(unsafeData);

  if (!success) {
    return { error: true, message: "Invalid product data" };
  }

  const user = await getCurrentUser();
  if (!canUpdateProduct(user)) {
    return { error: true, message: "Permission denied" };
  }

  const result = await updateProductDb(id, data);

  if (result?.error) {
    return { error: true, message: result.message };
  }

  return { success: true, message: "Product updated successfully" };
}
export async function deleteProduct(id: number) {
  const user = canDeleteProduct(await getCurrentUser());
  if (!user) {
    return { error: true, message: "Permission denied" };
  }
  await deleteProductDb(id);
  revalidateCategoryCache(id);
  return { success: true, message: "Product deleted successfully" };
}
