import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding JanDrishti database with deterministic demo data...');

  // 1. Roles
  const roles = ['CITIZEN', 'FIELD_WORKER', 'OFFICER', 'DISTRICT_ADMIN', 'ANALYST', 'AUDITOR', 'SUPER_ADMIN'];
  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
  }
  const citizenRole = await prisma.role.findUnique({ where: { name: 'CITIZEN' } });
  const officerRole = await prisma.role.findUnique({ where: { name: 'OFFICER' } });

  // 2. Geography
  const state = await prisma.state.upsert({
    where: { code: 'MP' },
    update: {},
    create: { code: 'MP', name: 'Madhya Pradesh' },
  });

  const district = await prisma.district.create({
    data: {
      stateId: state.id,
      code: 'IND',
      name: 'Indore',
    },
  });

  const ward = await prisma.ward.create({
    data: {
      districtId: district.id,
      code: 'W14',
      name: 'Ward 14',
    },
  });

  // 3. Issue Category
  const waterCategory = await prisma.issueCategory.upsert({
    where: { code: 'WATER' },
    update: {},
    create: { code: 'WATER', name: 'Water Supply', description: 'Issues related to drinking water, pipelines, and handpumps' },
  });

  // 4. Users & Citizens (Demo user: Meena)
  const meenaUser = await prisma.user.create({
    data: {
      firebaseUid: 'demo-firebase-uid-meena',
      roleId: citizenRole!.id,
    },
  });

  const meena = await prisma.citizen.create({
    data: {
      userId: meenaUser.id,
      displayName: 'Meena',
      preferredLanguage: 'hi',
      districtId: district.id,
      phoneLast4: '1234',
    },
  });

  const officerUser = await prisma.user.create({
    data: {
      firebaseUid: 'demo-firebase-uid-officer',
      roleId: officerRole!.id,
    },
  });

  await prisma.officer.create({
    data: {
      userId: officerUser.id,
      districtId: district.id,
      department: 'Water Board',
    },
  });

  // 5. Evidence Data
  await prisma.demographicSnapshot.create({
    data: {
      areaType: 'WARD',
      areaId: ward.id,
      population: 18430,
      source: 'SYNTHETIC_CENSUS',
      asOfDate: new Date(),
    },
  });

  await prisma.infrastructureAsset.create({
    data: {
      areaId: ward.id,
      categoryId: waterCategory.id,
      assetType: 'DRINKING_WATER_NETWORK',
      coverageScore: 42.0, // Low coverage
      conditionScore: 35.0, // Poor condition
      source: 'SYNTHETIC_INFRA',
      asOfDate: new Date(),
    },
  });

  // 6. Cluster (Hotspot)
  const cluster = await prisma.issueCluster.create({
    data: {
      categoryId: waterCategory.id,
      districtId: district.id,
      wardId: ward.id,
      title: 'Drinking Water Access',
      description: 'Persistent complaints about unsafe drinking water and broken handpumps in Ward 14.',
      reportCount: 1284,
      recurrenceScore: 85.0,
      semanticScore: 90.0,
      geographicScore: 95.0,
      hotspotScore: 92.0,
    },
  });

  // 7. Example Report for Meena (This matches the MVP scenario)
  const report = await prisma.report.create({
    data: {
      publicId: 'JR-2026-001284',
      citizenId: meena.id,
      sourceChannel: 'MOBILE',
      status: 'UNDER_REVIEW',
      language: 'hi',
      categoryId: waterCategory.id,
      subcategory: 'DRINKING_WATER',
      summary: 'Unsafe drinking water and frequently broken handpumps',
      description: 'हमारे गांव में पीने का पानी साफ नहीं है और हैंडपंप भी अक्सर खराब रहते हैं।',
      severity: 4,
      urgency: 4,
      aiConfidence: 0.94,
      clusterId: cluster.id,
      submittedAt: new Date(),
    },
  });

  await prisma.clusterMember.create({
    data: {
      clusterId: cluster.id,
      reportId: report.id,
      similarityScore: 0.98,
    },
  });

  // 8. Priority Score & Recommendation
  const priorityScore = await prisma.priorityScore.create({
    data: {
      clusterId: cluster.id,
      score: 92.0,
      demandComponent: 28.0, // out of 30
      severityComponent: 18.0, // out of 20
      needGapComponent: 18.0, // out of 20
      infrastructureComponent: 14.0, // out of 15
      populationComponent: 9.0, // out of 10
      planGapComponent: 5.0, // out of 5
      evidenceCompleteness: 100.0,
      confidence: 0.95,
    },
  });

  await prisma.recommendation.create({
    data: {
      clusterId: cluster.id,
      priorityScoreId: priorityScore.id,
      recommendationType: 'INFRASTRUCTURE_UPGRADE',
      title: 'Upgrade drinking-water infrastructure and repair/replace existing handpumps.',
      description: 'The area shows critical need for safe drinking water intervention.',
      reasoning: 'High recurring citizen demand (1284 reports). Low service coverage (42%). High population need (18,430). No matching active projects.',
      status: 'PENDING_REVIEW',
    },
  });

  console.log('Demo data seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
