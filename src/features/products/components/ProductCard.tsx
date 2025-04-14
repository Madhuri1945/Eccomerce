"use client";

import { Product } from "@prisma/client";
import { PencilIcon, TrashIcon } from "lucide-react"; // Importing icons

export default function ProductCard({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-md bg-white transition-transform transform hover:scale-105 hover:shadow-xl">
      <div className="flex items-center justify-between space-x-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-16 h-16 object-cover rounded-lg shadow-md transition-transform transform hover:scale-110"
        />
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900">
            {product.name}
          </h2>
          <p className="text-gray-600 text-sm">{product.description}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-green-600">${product.price}</p>
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={() => onEdit(product)}
              className="flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 hover:scale-105 transition-all ease-in-out duration-200"
            >
              <PencilIcon className="w-4 h-4 mr-1" />
              Edit
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="flex items-center px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 hover:scale-105 transition-all ease-in-out duration-200"
            >
              <TrashIcon className="w-4 h-4 mr-1" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
