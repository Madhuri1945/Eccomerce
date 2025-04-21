import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Product } from "@prisma/client";

interface Category {
  id: number; // Unique identifier for the category
  name: string; // Name of the category
  image: string; // Image URL or base64 string representing the category
  products: Product[]; // Array of related products
}

export default function CategoryDisplay(category: Category) {
  return (
    <div className="bg-secondary p-4 rounded-lg">
      {/* Category Header */}
      <div className="">
        <PageHeader title={category.name} />
      </div>

      {/* Product List */}
      <div className="flex flex-wrap gap-4">
        {category.products.map((product: Product) => (
          <Card key={product.id} className="w-48 p-3">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-32 object-cover rounded-md mb-1"
            />
            <h3 className="text-sm font-medium">{product.name}</h3>
            <a href="#">
              <p className="text-gray-700 text-sm">
                {product.description
                  ? product.description.length > 30
                    ? `${product.description.slice(0, 30)}..`
                    : product.description
                  : ""}
              </p>
            </a>

            <p className="text-sm text-gray-500">₹{product.price}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
