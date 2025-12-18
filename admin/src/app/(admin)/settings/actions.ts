"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/server";

const createPageSchema = z.object({
  fbPageId: z.string().min(1).max(64).transform((v) => v.trim()),
  name: z.string().max(200).optional().transform((v) => (v ? v.trim() : undefined)),
});

export type CreatePageState = { error?: string };

export async function createPageAction(
  _prev: CreatePageState,
  formData: FormData,
): Promise<CreatePageState> {
  const user = await requireUser();
  if (user.role !== "SUPER_ADMIN") {
    return { error: "เฉพาะ SUPER_ADMIN เท่านั้นที่เพิ่มเพจได้" };
  }

  const parsed = createPageSchema.safeParse({
    fbPageId: formData.get("fbPageId"),
    name: formData.get("name"),
  });

  if (!parsed.success) return { error: "ข้อมูลไม่ถูกต้อง" };

  const { fbPageId, name } = parsed.data;

  try {
    const page = await db.page.create({
      data: {
        fbPageId,
        name,
        members: {
          create: {
            userId: user.id,
            isOwner: true,
          },
        },
      },
      select: { id: true },
    });

    revalidatePath("/settings");
    revalidatePath(`/filters?pageId=${page.id}`);
    return {};
  } catch {
    return { error: "เพิ่มเพจไม่สำเร็จ (อาจมี fbPageId ซ้ำ)" };
  }
}
