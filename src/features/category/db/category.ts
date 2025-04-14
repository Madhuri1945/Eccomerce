import { PrismaClient, Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { revalidateCategoryCache } from "./cache";
// Initialize Prisma Client outside the function to avoid reinitialization
const prisma = new PrismaClient();

// Function to insert a new category
export async function insertCategory(data: Prisma.CategoryCreateInput) {
  try {
    // Using upsert to create or update the category based on its unique 'name'
    const newCategory = await prisma.category.upsert({
      where: { name: data.name }, // Assuming 'name' is unique for categories
      create: data,
      update: data,
    });

    console.log("Category inserted or updated successfully.");
    revalidateCategoryCache(newCategory.id);
    return newCategory; // Returning the created/updated category
  } catch (error) {
    console.error("Error creating category:", error);
    return { error: true, message: "There was an error creating the category" };
  }
}

// Function to update an existing category
export async function updateCategory(
  id: number, // The category ID to update
  data: Partial<{
    name: string;
    image: string;
  }> & { productIds?: number[] } // Optionally, product IDs to associate
) {
  try {
    // Use a transaction to ensure atomicity of the operations
    const updatedCategory = await prisma.$transaction(async (trx) => {
      // Update the category fields if provided
      const category = await trx.category.update({
        where: { id },
        data: {
          name: data.name ?? undefined, // Only update if provided
          image: data.image ?? undefined, // Only update if provided
        },
      });

      if (!category) {
        throw new Error("Category not found or failed to update.");
      }

      // If product associations are provided, update them
      if (data.productIds) {
        // Remove existing product associations by setting categoryId to null
        await trx.product.updateMany({
          where: { categoryId: id },
          data: { categoryId: undefined }, // Remove the association
        });

        // Add new product associations (if there are any)
        await trx.product.updateMany({
          where: { id: { in: data.productIds } },
          data: { categoryId: id }, // Assign new category to selected products
        });
      }

      return category; // Return the updated category
    });

    return updatedCategory; // Returning the result of the transaction
  } catch (error) {
    console.error("Error updating category:", error);
    return { error: true, message: "There was an error updating the category" };
  }
}
