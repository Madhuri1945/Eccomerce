import { getCategoryIdTag } from "@/features/category/db/cache";
import ProductCardList from "@/features/products/components/ProductCardList";
import prisma from "@/lib/db";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export default async function viewProducts({
  params,
}: {
  params: { category: string };
}) {
  const resolvedParams = await params;
  const categoryId = parseInt(resolvedParams.category, 10);

  if (isNaN(categoryId)) {
    console.error("Invalid category ID:", params.category);
    return <div>Invalid category ID.</div>;
  }

  const category = await fetchCategoryWithProducts(categoryId);

  if (!category) {
    console.error("Category not found for ID:", categoryId);
    return <div>Category not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6">
        Products in {category.name}:
      </h1>
      {category.products.length === 0 ? (
        <p>No products available for this category.</p>
      ) : (
        <ProductCardList products={category.products} />
      )}
    </div>
  );
}
export async function fetchCategoryWithProducts(categoryId: number) {
  "use cache";
  cacheTag(getCategoryIdTag(categoryId));
  return await prisma.category.findUnique({
    where: { id: categoryId },
    include: { products: true },
  });
}
