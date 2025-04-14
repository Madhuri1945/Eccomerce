import { Role } from "@prisma/client";
export default function canAccessAdminPages({
  role,
}: {
  role: Role | undefined;
}) {
  return role === "ADMIN";
}
