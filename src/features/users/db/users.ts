import { Prisma, PrismaClient } from "@prisma/client";
import { revalidateUserCache } from "./cache";

const prisma = new PrismaClient();

export async function insertUser(data: Prisma.UserCreateInput) {
  const newUser = await prisma.user.upsert({
    where: { clerkUserId: data.clerkUserId },
    create: data,
    update: data,
  });
  if (!newUser) throw new Error("Failed to create user");
  revalidateUserCache(newUser.id);
  return newUser;
}
export async function updateUser(
  { clerkUserId }: { clerkUserId: string },
  data: Prisma.UserUpdateInput
) {
  const updatedUser = await prisma.user.update({
    where: { clerkUserId },
    data,
  });
  if (!updatedUser) throw new Error("Failed to update user");
  revalidateUserCache(updatedUser.id);
  return updatedUser;
}
export async function deleteUser({ clerkUserId }: { clerkUserId: string }) {
  const deletedUser = await prisma.user.update({
    where: { clerkUserId },
    data: {
      deletedAt: new Date(),
      email: "redacted@deleted.com",
      name: "Deleted User",
      clerkUserId: "deleted",
      imageUrl: null,
    },
  });
  if (!deletedUser) {
    throw new Error("Failed to delete user");
  }
  revalidateUserCache(deletedUser.id);
  return deleteUser;
}
