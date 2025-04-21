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
  insertSubCategory,
  updateProduct as updateProductDb,
  deleteProduct as deleteProductDb,
} from "../db/product";
// New import for inserting a subcategory
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

  // Check if subCategoryId exists, otherwise create a new subcategory
  let subCategoryId = data.subCategoryId;

  if (!subCategoryId && data.subCategoryName) {
    // Subcategory does not exist, create it
    const newSubCategory = await insertSubCategory({
      name: data.subCategoryName,
      categoryId: data.categoryId,
    });

    if (newSubCategory.error) {
      return { error: true, message: "Failed to create subcategory" };
    }

    subCategoryId = newSubCategory.id; // Use the subcategory ID from the result
  }

  // Ensure description is a string, default to empty string if undefined
  const processedData = {
    ...data,
    description: data.description || "",
    subCategoryId, // Use the created or existing subcategory ID
  };

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
export async function createSubCategory(data: {
  name: string;
  categoryId: number;
}) {
  try {
    const newSubCategory = await insertSubCategory(data);

    // Step 3: Revalidate any relevant cache
    revalidateCategoryCache(data.categoryId);

    // Step 4: Return success response
    return {
      success: true,
      message: "Subcategory created successfully",
      subCategory: newSubCategory,
    };
  } catch (error) {
    console.error("Error creating subcategory:", error);
    return { error: true, message: "Failed to create subcategory" };
  }
}
