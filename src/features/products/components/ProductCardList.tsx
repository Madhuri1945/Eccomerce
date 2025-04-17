"use client";
import { useState } from "react";
import { Product } from "@prisma/client";
import ProductCard from "@/features/products/components/ProductCard";
import { ProductForm } from "@/features/category/components/ProductForm";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "../actions/product";
import { toast } from "sonner";

export default function ProductCardList({ products }: { products: Product[] }) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Function to handle edit action
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  // Function to handle delete action
  const handleDelete = async (id: number) => {
    await deleteProduct(id);
    toast.success("product deleted successfully");
  };

  // Function to reset the editing state (close modal)
  const handleClose = () => {
    setEditingProduct(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Display Product Cards */}
      {products.map((product) => (
        <div key={product.id}>
          <ProductCard
            product={product}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      ))}

      {/* Modal for ProductForm */}
      <Dialog.Root open={!!editingProduct} onOpenChange={handleClose}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed inset-0 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-lg">
              <Dialog.Title className="text-lg font-semibold mb-4">
                {editingProduct
                  ? `Edit Product: ${editingProduct.name}`
                  : "Add Product"}
              </Dialog.Title>
              {editingProduct && (
                <ProductForm
                  product={{
                    ...editingProduct,
                    categoryId: editingProduct?.categoryId ?? 0, // Default to 0 if null
                    subCategory: editingProduct?.subCategory || "",
                    description: editingProduct.description ?? undefined,
                  }}
                  categoryId={editingProduct.categoryId || 0}
                  onSave={handleClose}
                />
              )}
              <Dialog.Close asChild>
                <Button className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600">
                  Close
                </Button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
