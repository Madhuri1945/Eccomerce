type CACHE_TAG =
  | "users"
  | "products"
  | "carts"
  | "orders"
  | "cartItems"
  | "category";

// Generate Global Tag
export function getGlobalTag(tag: CACHE_TAG) {
  return `global:${tag}` as const;
}

// Generate ID-Specific Tag
export function getIdTag(tag: CACHE_TAG, id: number) {
  return `id:${id}-${tag}` as const;
}

// Generate User-Specific Tag (For Carts, Orders, etc.)
export function getUserTag(tag: CACHE_TAG, userId: number) {
  return `user:${userId}-${tag}` as const;
}
export function getCategoryTag(tag: CACHE_TAG, categoryId: number) {
  return `category:${categoryId}-${tag}` as const;
}
// Generate Product-Specific Tag
export function getProductTag(tag: CACHE_TAG, productId: number) {
  return `product:${productId}-${tag}` as const;
}

// Generate Cart-Specific Tag (Based on User ID)
export function getCartTag(userId: number) {
  return `cart:user:${userId}` as const;
}

// Generate Order-Specific Tag (Based on User ID)
export function getOrderTag(userId: number) {
  return `order:user:${userId}` as const;
}
