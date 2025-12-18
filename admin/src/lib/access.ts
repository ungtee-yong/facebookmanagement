import { db } from "@/lib/db";
import type { UserRole } from "@prisma/client";

export type CurrentUser = {
  id: string;
  role: UserRole;
};

export async function canAccessPage(user: CurrentUser, pageId: string) {
  if (user.role === "SUPER_ADMIN") return true;

  const membership = await db.pageMember.findUnique({
    where: { pageId_userId: { pageId, userId: user.id } },
    select: { id: true },
  });

  return Boolean(membership);
}
