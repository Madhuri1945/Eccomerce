import { Prisma, Role, User } from "@prisma/client";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { getUserIdTag } from "@/features/users/db/cache";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
const client = await clerkClient();
export async function getCurrentUser({ allData = false } = {}) {
  const { userId, sessionClaims, redirectToSignIn } = await auth();
  if (userId != null && sessionClaims.dbId == null) {
    redirect("api/clerk/syncUsers");
  }
  return {
    clerkUserId: userId,
    role: sessionClaims?.role,
    user:
      allData && sessionClaims?.dbId != null
        ? await getUser(sessionClaims.dbId)
        : undefined,
    redirectToSignIn,
  };
}
export function syncClerkUserMetadata(user: {
  id: number;
  clerkUserId: string;
  role: Role;
}) {
  return client.users.updateUserMetadata(user.clerkUserId, {
    publicMetadata: {
      dbId: user.id,
      role: user.role,
    },
  });
}
async function getUser(id: number) {
  "use cache";
  cacheTag(getUserIdTag(id));
  return prisma.user.findFirst({
    where: {
      id: id,
    },
  });
}
