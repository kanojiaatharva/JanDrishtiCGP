import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed(): Promise<void> {
  await prisma.scoringConfiguration.upsert({
    where: { version: 1 },
    update: {},
    create: {
      version: 1,
      active: true,
      weights: {
        demand: 0.3,
        severity: 0.2,
        needGap: 0.2,
        infrastructureGap: 0.15,
        populationNeed: 0.1,
        planGap: 0.05,
      },
    },
  });

  await prisma.district.upsert({
    where: { code: 'INDORE' },
    update: { name: 'Indore (Synthetic Demo District)' },
    create: {
      code: 'INDORE',
      name: 'Indore (Synthetic Demo District)',
      wards: {
        create: {
          code: 'WARD-14',
          name: 'Ward 14 (Synthetic)',
        },
      },
    },
  });
}

void seed()
  .then(() => prisma.$disconnect())
  .catch(async (error: unknown) => {
    await prisma.$disconnect();
    throw error;
  });

