import type { UserRole } from "@prisma/client";

export type SessionPayload = {
  userId: string;
  email: string;
  role: UserRole;
};
