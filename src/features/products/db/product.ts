import { Prisma } from "@prisma/client";
import { productSchema } from "../schema";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

// Function to insert a product
export async function insertProduct(
  data: Omit<Prisma.ProductCreateInput, "category" | "subCategory"> & {
    id?: number;
    categoryId: number;
    subCategoryId?: number;
  }
) {
  try {
    const newProduct = await prisma.product.upsert({
      where: { id: data.id || 0 },
      create: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        image: data.image,
        category: { connect: { id: data.categoryId } }, // Connect to the category by ID
        subCategory: data.subCategoryId
          ? { connect: { id: data.subCategoryId } }
          : undefined, // Connect to the subcategory if provided
      },
      update: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        image: data.image,
        category: { connect: { id: data.categoryId } },
        subCategory: data.subCategoryId
          ? { connect: { id: data.subCategoryId } }
          : undefined,
      },
    });

    return newProduct;
  } catch (error) {
    console.error("Error creating the product:", error);
    return { error: true, message: "There was an error creating the product" };
  }
}

// Function to update a product
export async function updateProduct(
  id: number,
  data: Prisma.ProductUpdateInput
) {
  try {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data,
    });
  } catch (err) {
    return { error: true, message: "There was an error updating the product" };
  }
}

// Function to delete a product
export async function deleteProduct(id: number) {
  try {
    const deletedProduct = await prisma.product.delete({
      where: { id },
    });
  } catch (err) {
    return { error: true, message: "There was an error deleting the product" };
  }
}

// Function to insert a subcategory (if it doesn't exist)
export async function insertSubCategory({
  name,
  categoryId,
}: {
  name: string;
  categoryId: number;
}) {
  try {
    // Check if the subcategory already exists
    const existingSubCategory = await prisma.subCategory.findFirst({
      where: {
        name,
        categoryId,
      },
    });

    // If the subcategory doesn't exist, create a new one
    if (!existingSubCategory) {
      const newSubCategory = await prisma.subCategory.create({
        data: {
          name,
          categoryId,
        },
      });
      return newSubCategory; // Return the newly created subcategory
    }

    return existingSubCategory; // Return the existing subcategory
  } catch (error) {
    console.error("Error creating the subcategory:", error);
    return {
      error: true,
      message: "There was an error creating the subcategory",
    };
  }
}
