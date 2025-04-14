import { PageHeader } from "@/components/PageHeader";
import { CategoryForm } from "@/features/category/components/CategoryForm";

export default function NewCategoryPage() {
  return (
    <div className="container my-6">
      <PageHeader title="New Category" />
      <CategoryForm />
    </div>
  );
}
