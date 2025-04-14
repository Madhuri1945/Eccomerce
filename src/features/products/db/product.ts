import { Prisma } from "@prisma/client";
import { productSchema } from "../schema";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

export async function insertProduct(
  data: Prisma.ProductCreateInput & { id?: number }
) {
  try {
    const newProduct = await prisma.product.upsert({
      where: { id: data.id || 0 },
      create: data,
      update: data,
    });
  } catch (error) {
    return { error: true, message: "There was an error creating the category" };
  }
}
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
    return { error: true, message: "There was an error updating the category" };
  }
}
export async function deleteProduct(id: number) {
  try {
    const deletedProduct = await prisma.product.delete({
      where: { id },
    });
  } catch (err) {
    return { error: true, message: "There was an error updating the category" };
  }
}
