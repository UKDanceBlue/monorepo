import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

console.log("prisma.ts");
console.log(
  await prisma.person.findMany({
    take: 20,
    where: { committeeRole: { not: null } },
  })
);
