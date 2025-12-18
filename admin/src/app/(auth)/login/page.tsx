import { redirect } from "next/navigation";
import { getSessionPayload } from "@/lib/auth/server";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  const session = await getSessionPayload();
  if (session) redirect("/dashboard");

  return <LoginForm />;
}
