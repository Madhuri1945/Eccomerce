import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";
export function getUserGlobalTag() {
  return getGlobalTag("users");
}

export function getUserIdTag(userId: number) {
  return getIdTag("users", userId);
}
export function revalidateUserCache(id: number) {
  revalidateTag(getUserGlobalTag());
  revalidateTag(getUserIdTag(id));
}
