import { Role } from "@prisma/client";
export function canCreateCategory({ role }: { role: Role | undefined }) {
  return role === "ADMIN";
}
export function canUpdateCategory({ role }: { role: Role | undefined }) {
  return role === "ADMIN";
}
