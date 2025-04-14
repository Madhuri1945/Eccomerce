import { getCategoryGlobalTag } from "@/features/category/db/cache";
import prisma from "@/lib/db";
import { Category } from "@prisma/client";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export default async function SideBar() {
  const categories = await getCategories();
  return (
    <div className="w-full m-3 p-4 bg-secondary">
      <div className="flex gap-4 overflow-x-auto">
        {categories.map((category: Category) => (
          <div
            key={category.id}
            className="flex flex-col items-center text-center space-y-2"
          >
            {/* Category Image */}
            <img
              src={category.image}
              alt={category.name}
              className="w-20 h-20 object-cover rounded-full shadow-md"
            />
            {/* Category Name */}
            <span className="text-sm text-gray-700 font-semibold">
              {category.name}
            </span>
          </div>
        ))}
      </div>
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
    },
  });
}
