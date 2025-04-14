"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; // Updated import for useRouter in Next.js
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { productSchema } from "@/features/products/schema";
import {
  createProduct,
  updateProduct,
} from "@/features/products/actions/product";

// ProductForm Component
export function ProductForm({
  product,
  categoryId,
  onSave,
}: {
  product?: {
    id: number;
    name: string;
    description?: string;
    price: number;
    stock: number;
    image: string;
    categoryId: number;
  };
  categoryId: number;
  onSave?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Ensure correct router usage with "next/navigation"

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      stock: product?.stock || 0,
      image: product?.image || "",
      categoryId,
    },
  });

  // Handle form submission
  async function onSubmit(values: z.infer<typeof productSchema>) {
    setLoading(true);
    try {
      // Ensure price and stock are numbers
      const processedValues = {
        ...values,
        price: Number(values.price), // Coerce value to number
        stock: Number(values.stock),
      };

      if (!product) {
        await createProduct(processedValues);
        toast.success("Product created successfully!");
        router.push("/admin/category"); // Navigate after successful creation
      } else {
        await updateProduct(product.id, processedValues);
        toast.success("Product updated successfully!");
        if (onSave) {
          onSave();
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter product name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter product description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  placeholder="Enter price"
                  step="0.01"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Stock */}
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input type="number" {...field} placeholder="Enter stock" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image URL */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter image URL" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Saving..." : "Save Product"}
        </Button>
      </form>
    </Form>
  );
}
