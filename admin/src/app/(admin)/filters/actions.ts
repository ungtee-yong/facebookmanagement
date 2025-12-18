"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/server";
import { canAccessPage } from "@/lib/access";

const addSchema = z.object({
  pageId: z.string().min(1),
  kind: z.enum(["INCLUDE", "EXCLUDE"]),
  keyword: z
    .string()
    .min(1)
    .max(100)
    .transform((v) => v.trim()),
});

export async function addFilterAction(_prev: { error?: string }, formData: FormData) {
  const user = await requireUser();

  const parsed = addSchema.safeParse({
    pageId: formData.get("pageId"),
    kind: formData.get("kind"),
    keyword: formData.get("keyword"),
  });

  if (!parsed.success) {
    return { error: "ข้อมูลไม่ถูกต้อง" };
  }

  const { pageId, kind, keyword } = parsed.data;

  const ok = await canAccessPage({ id: user.id, role: user.role }, pageId);
  if (!ok) return { error: "ไม่มีสิทธิ์เข้าถึงเพจนี้" };

  try {
    await db.keywordFilter.create({
      data: { pageId, kind, keyword },
    });
  } catch {
    return { error: "เพิ่ม keyword ไม่สำเร็จ (อาจซ้ำ)" };
  }

  revalidatePath(`/filters?pageId=${pageId}`);
  return {};
}

export async function toggleFilterAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") || "");
  const pageId = String(formData.get("pageId") || "");

  if (!id || !pageId) return;

  const ok = await canAccessPage({ id: user.id, role: user.role }, pageId);
  if (!ok) return;

  const current = await db.keywordFilter.findUnique({
    where: { id },
    select: { enabled: true },
  });
  if (!current) return;

  await db.keywordFilter.update({
    where: { id },
    data: { enabled: !current.enabled },
  });

  revalidatePath(`/filters?pageId=${pageId}`);
}

export async function deleteFilterAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") || "");
  const pageId = String(formData.get("pageId") || "");

  if (!id || !pageId) return;

  const ok = await canAccessPage({ id: user.id, role: user.role }, pageId);
  if (!ok) return;

  await db.keywordFilter.delete({ where: { id } });
  revalidatePath(`/filters?pageId=${pageId}`);
}
