import { getCategoryGlobalTag } from "@/features/category/db/cache";
import CategoryDisplay from "@/features/consumer/components/CategoryDisplay";
import prisma from "@/lib/db";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { Product } from "@prisma/client";
import { Description } from "@radix-ui/react-dialog";
interface Category {
  id: number; // Unique identifier for the category
  name: string; // Name of the category
  image: string; // Image URL or base64 string representing the category
  products: Product[]; // Array of related products
}
export default async function Body() {
  const categories = await getCategories();

  return (
    <div className="container p-6 space-y-8 ">
      {categories.map((category: Category) => (
        <CategoryDisplay
          key={category.id}
          id={category.id}
          name={category.name}
          image={category.image}
          products={category.products || []} // Ensure products is provided
        />
      ))}
    </div>
  );
}

async function getCategories() {
  "use cache";
  cacheTag(getCategoryGlobalTag());
  return await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      image: true,
      products: {
        select: {
          id: true,
          name: true,
          price: true,
          image: true,
          description: true,
        },
      },
    },
  });
}
