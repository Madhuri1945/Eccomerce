import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getCategoryGlobalTag } from "@/features/category/db/cache";
import CategoryBox from "@/features/category/components/CategoryBox";

import prisma from "@/lib/db";
export default async function CategoryPage() {
  const categories = await getCategory();
  return (
    <div className="container">
      <PageHeader title="Category">
        <Button asChild>
          <Link href="/admin/category/new">New Category</Link>
        </Button>
      </PageHeader>

      <CategoryBox categories={categories} />
    </div>
  );
}
async function getCategory() {
  "use cache";
  cacheTag(getCategoryGlobalTag());
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      image: true,
    },
  });
  return categories;
}
