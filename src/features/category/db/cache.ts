import { getGlobalTag, getCategoryTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";
export function getCategoryGlobalTag() {
  return getGlobalTag("category");
}
export function getCategoryIdTag(categoryId: number) {
  return getCategoryTag("category", categoryId);
}
export function revalidateCategoryCache(id: number) {
  revalidateTag(getCategoryGlobalTag());
  revalidateTag(getCategoryIdTag(id));
}
