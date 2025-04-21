import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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
  createSubCategory,
} from "@/features/products/actions/product";

// Ensure you have this import.

export function ProductForm({
  product,
  categoryId,
  onSave,
  subCategories,
}: {
  product?: {
    id: number;
    name: string;
    description?: string;
    price: number;
    stock: number;
    image: string;
    subCategoryId?: number;
    categoryId: number;
  };
  categoryId: number;
  onSave?: () => void;
  subCategories: { id: number; name: string }[]; // Ensure subCategories is an array
}) {
  const [loading, setLoading] = useState(false);
  const [localSubCategories, setLocalSubCategories] = useState(
    subCategories || []
  ); // Default to empty array if subCategories is undefined
  const [newSubCategory, setNewSubCategory] = useState("");
  const router = useRouter();

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      stock: product?.stock || 0,
      image: product?.image || "",
      subCategoryId: product?.subCategoryId || undefined,
      categoryId,
    },
  });

  async function handleNewSubCategory(name: string) {
    try {
      const response = await createSubCategory({ name, categoryId });
      if (response.success && response.subCategory) {
        setLocalSubCategories((prev) => [
          ...prev,
          { id: response.subCategory.id, name: response.subCategory.name },
        ]);
        return response.subCategory.id;
      } else {
        throw new Error(response.message || "Failed to create subcategory");
      }
    } catch (err) {
      toast.error("Failed to create subcategory");
      throw err;
    }
  }

  async function onSubmit(values: z.infer<typeof productSchema>) {
    setLoading(true);
    try {
      let subCategoryId = values.subCategoryId;

      if (newSubCategory) {
        subCategoryId = await handleNewSubCategory(newSubCategory);
      }

      const processedValues = {
        ...values,
        price: Number(values.price),
        stock: Number(values.stock),
        subCategoryId,
      };

      if (!product) {
        await createProduct(processedValues);
        toast.success("Product created successfully!");
        router.push("/admin/category");
      } else {
        await updateProduct(product.id, processedValues);
        toast.success("Product updated successfully!");
        if (onSave) onSave();
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
                  onChange={(e) => field.onChange(Number(e.target.value))}
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
                <Input
                  type="number"
                  {...field}
                  placeholder="Enter stock"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* SubCategory */}
        <FormField
          control={form.control}
          name="subCategoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SubCategory</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value?.toString() || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {localSubCategories &&
                      localSubCategories.map((subCategory) => (
                        <SelectItem
                          key={subCategory.id}
                          value={subCategory.id.toString()}
                        >
                          {subCategory.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* New SubCategory */}
        <FormItem>
          <FormLabel>New SubCategory</FormLabel>
          <FormControl>
            <Input
              placeholder="Enter a new subcategory"
              value={newSubCategory}
              onChange={(e) => setNewSubCategory(e.target.value)}
            />
          </FormControl>
        </FormItem>

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
