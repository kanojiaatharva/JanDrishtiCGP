import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Roles
  const roles = ['CITIZEN', 'OFFICER', 'DISTRICT_ADMIN', 'SUPER_ADMIN'];
  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
  }

  const superAdminRole = await prisma.role.findUniqueOrThrow({ where: { name: 'SUPER_ADMIN' } });
  const districtAdminRole = await prisma.role.findUniqueOrThrow({ where: { name: 'DISTRICT_ADMIN' } });
  const officerRole = await prisma.role.findUniqueOrThrow({ where: { name: 'OFFICER' } });
  const citizenRole = await prisma.role.findUniqueOrThrow({ where: { name: 'CITIZEN' } });

  // 2. Geography
  const state = await prisma.state.upsert({
    where: { code: 'MP' },
    update: {},
    create: { name: 'Madhya Pradesh', code: 'MP' },
  });

  const districtX = await prisma.district.upsert({
    where: { name_stateId: { name: 'District X', stateId: state.id } },
    update: {},
    create: { name: 'District X', stateId: state.id },
  });

  const wards = ['Ward 14', 'Ward 7', 'Ward 3'];
  for (const wardName of wards) {
    await prisma.ward.upsert({
      where: { name_districtId: { name: wardName, districtId: districtX.id } },
      update: {},
      create: { name: wardName, districtId: districtX.id },
    });
  }

  // 3. Demo Users (DEVELOPMENT ONLY)
  // WARNING: These credentials are for development use only!
  
  // Super Admin
  const superAdmin = await prisma.user.upsert({
    where: { email: 'super@jandrishti.gov.in' },
    update: {},
    create: {
      email: 'super@jandrishti.gov.in',
      password: '$argon2id$v=19$m=65536,t=3,p=4$wN0Z3rT7q5U$J8j2gG3W9L8o6bH7g1J0vK5rF2zD8eL4cN3qR6wT0gU', // password: admin
      roleId: superAdminRole.id,
    },
  });

  // District Admin
  const districtAdmin = await prisma.user.upsert({
    where: { email: 'admin.x@jandrishti.gov.in' },
    update: {},
    create: {
      email: 'admin.x@jandrishti.gov.in',
      password: '$argon2id$v=19$m=65536,t=3,p=4$wN0Z3rT7q5U$J8j2gG3W9L8o6bH7g1J0vK5rF2zD8eL4cN3qR6wT0gU', // password: admin
      roleId: districtAdminRole.id,
      officerProfile: {
        create: {
          firstName: 'District',
          lastName: 'Administrator',
          designation: 'Collector',
          districtId: districtX.id,
        }
      }
    },
  });

  // Officer
  const officer = await prisma.user.upsert({
    where: { email: 'officer.x@jandrishti.gov.in' },
    update: {},
    create: {
      email: 'officer.x@jandrishti.gov.in',
      password: '$argon2id$v=19$m=65536,t=3,p=4$wN0Z3rT7q5U$J8j2gG3W9L8o6bH7g1J0vK5rF2zD8eL4cN3qR6wT0gU', // password: admin
      roleId: officerRole.id,
      officerProfile: {
        create: {
          firstName: 'Jane',
          lastName: 'Doe',
          designation: 'Field Officer',
          districtId: districtX.id,
        }
      }
    },
  });

  // Citizen
  const citizen = await prisma.user.upsert({
    where: { phone: '+919999999999' },
    update: {},
    create: {
      phone: '+919999999999',
      roleId: citizenRole.id,
      citizenProfile: {
        create: {
          firstName: 'Demo',
          lastName: 'Citizen',
          languagePreference: 'hi',
        }
      }
    },
  });

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
