import prisma from './prismaClient';

async function main() {
  const accounts = Array.from({ length: 20 }, (_, i) => ({
    account_id: i + 1,
    employee_id: 1000 + i,
    username: `user${i + 1}`,
    password_hash: 'Tvx1234@', // password mặc định
    role_id: (i % 3) + 1,
    last_login: null,
  }));

  await prisma.account.createMany({ data: accounts, skipDuplicates: true });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
