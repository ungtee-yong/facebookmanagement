import { requireUser } from "@/lib/auth/server";
import { AdminShell } from "./components/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return <AdminShell user={user}>{children}</AdminShell>;
}
