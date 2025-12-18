import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

async function main() {
  const db = new PrismaClient();

  const email = (process.env.SEED_SUPERADMIN_EMAIL || "admin@example.com").toLowerCase();
  const password = process.env.SEED_SUPERADMIN_PASSWORD || "admin1234";

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`[seed] Super admin already exists: ${email}`);
    return;
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  await db.user.create({
    data: {
      email,
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true,
      name: "Super Admin",
    },
  });

  console.log(`[seed] Created super admin: ${email}`);
  console.log(`[seed] Password: ${password}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
