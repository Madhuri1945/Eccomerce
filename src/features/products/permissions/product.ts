import { Role } from "@prisma/client";
export function canCreateProduct({ role }: { role: Role | undefined }) {
  return role === "ADMIN";
}
export function canUpdateProduct({ role }: { role: Role | undefined }) {
  return role === "ADMIN";
}
export function canDeleteProduct({ role }: { role: Role | undefined }) {
  return role === "ADMIN";
}
