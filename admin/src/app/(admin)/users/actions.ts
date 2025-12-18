"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/server";
import { hashPassword } from "@/lib/auth/password";

function randomPassword(length = 12) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

const createSchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase()),
  name: z.string().max(200).optional().transform((v) => (v ? v.trim() : undefined)),
  role: z.enum(["ADMIN", "AGENT"]),
  password: z.string().optional().transform((v) => (v ? String(v) : "")),
});

export type CreateUserState = { error?: string; createdEmail?: string; createdPassword?: string };

export async function createUserAction(
  _prev: CreateUserState,
  formData: FormData,
): Promise<CreateUserState> {
  const actor = await requireUser();
  if (actor.role !== "SUPER_ADMIN") {
    return { error: "เฉพาะ SUPER_ADMIN เท่านั้น" };
  }

  const parsed = createSchema.safeParse({
    email: formData.get("email"),
    name: formData.get("name"),
    role: formData.get("role"),
    password: formData.get("password"),
  });

  if (!parsed.success) return { error: "ข้อมูลไม่ถูกต้อง" };

  const { email, name, role } = parsed.data;
  const password = parsed.data.password || randomPassword();

  const passwordHash = await hashPassword(password);

  try {
    await db.user.create({
      data: {
        email,
        name,
        role,
        passwordHash,
        isActive: true,
      },
    });
  } catch {
    return { error: "สร้างผู้ใช้ไม่สำเร็จ (อาจมีอีเมลซ้ำ)" };
  }

  revalidatePath("/users");
  return { createdEmail: email, createdPassword: password };
}

export async function toggleUserActiveAction(formData: FormData) {
  const actor = await requireUser();
  if (actor.role !== "SUPER_ADMIN") return;

  const id = String(formData.get("id") || "");
  if (!id) return;

  const user = await db.user.findUnique({ where: { id }, select: { isActive: true } });
  if (!user) return;

  await db.user.update({ where: { id }, data: { isActive: !user.isActive } });
  revalidatePath("/users");
}

export async function resetUserPasswordAction(formData: FormData) {
  const actor = await requireUser();
  if (actor.role !== "SUPER_ADMIN") return;

  const id = String(formData.get("id") || "");
  if (!id) return;

  const newPassword = randomPassword();
  const passwordHash = await hashPassword(newPassword);

  await db.user.update({ where: { id }, data: { passwordHash } });

  // In real life: send password via secure channel.
  // (We intentionally don't return it from the server action to keep the form action type-safe.)
  revalidatePath("/users");
}
