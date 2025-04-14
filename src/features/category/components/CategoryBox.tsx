"use client";
import { Category } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { ProductForm } from "./ProductForm";

interface CategoryBoxProps {
  categories?: {
    id: number;
    name: string;
    image: string;
  }[];
}

export default function CategoryBox({ categories }: CategoryBoxProps) {
  if (!categories || categories.length === 0) {
    return <div>No categories available.</div>;
  }

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  // Function to handle saving product and closing the modal
  const handleSave = () => {
    setSelectedCategory(null); // Close the modal by clearing the selected category
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {categories.map((category) => (
        <div
          key={category.id}
          className="relative w-full h-64 rounded-2xl overflow-hidden shadow-lg group"
        >
          {/* Image */}
          <img
            src={category.image}
            alt={category.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300"></div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-between p-4">
            <div className="text-white text-lg font-semibold">
              {category.name}
            </div>
            <div className="flex gap-2 mt-2">
              {/* Add Product Button */}
              <Dialog.Root
                open={selectedCategory?.id === category.id}
                onOpenChange={(open) => open || setSelectedCategory(category)}
              >
                <Dialog.Trigger asChild>
                  <Button
                    className="ml-auto bg-primary text-white py-2 px-4 rounded-lg shadow-md hover:bg-primary/90"
                    onClick={() => setSelectedCategory(category)}
                  >
                    Add Products
                  </Button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                  <Dialog.Title>
                    <Dialog.Content className="fixed inset-0 flex items-center justify-center">
                      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-lg">
                        <h2 className="text-lg font-semibold mb-4">
                          Add Product to {category.name}
                        </h2>
                        <ProductForm
                          categoryId={category.id}
                          onSave={handleSave}
                        />
                        <Dialog.Close asChild>
                          <Button className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600">
                            Close
                          </Button>
                        </Dialog.Close>
                      </div>
                    </Dialog.Content>
                  </Dialog.Title>
                </Dialog.Portal>
              </Dialog.Root>

              {/* View Products Button */}
              <Link href={`/admin/category/${category.id}/products`}>
                <Button className="ml-auto bg-secondary text-black py-2 px-4 rounded-lg shadow-md hover:bg-secondary/90">
                  View Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
