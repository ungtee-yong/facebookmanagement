import bcrypt from 'bcryptjs';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_SUPERADMIN_EMAIL ?? 'admin@example.com';
  const password = process.env.SEED_SUPERADMIN_PASSWORD ?? 'admin1234';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Seed: user already exists: ${email}`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: {
      email,
      name: 'Super Admin',
      role: UserRole.SUPER_ADMIN,
      passwordHash
    }
  });

  console.log(`Seed: created super admin ${email}`);
  console.log(`Seed: password is '${password}' (change this in production)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
