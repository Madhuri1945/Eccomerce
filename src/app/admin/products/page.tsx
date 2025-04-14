import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
export default async function ProductsPage() {
  const products = await getProducts();
  return (
    <div className="container">
      <PageHeader title="Products">
        <Button asChild>
          <Link href="/admin/products/new">New Category</Link>
        </Button>
      </PageHeader>
    </div>
  );
}
async function getProducts() {}
