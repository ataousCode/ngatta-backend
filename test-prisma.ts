import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

async function test() {
  console.log('ENV DATABASE_URL:', process.env.DATABASE_URL);
  try {
    const prisma = new PrismaClient();
    console.log('Prisma initialized successfully');
    await prisma.$connect();
    console.log('Prisma connected successfully');
    await prisma.$disconnect();
  } catch (e) {
    console.error('Prisma initialization failed:', e);
  }
}

test();
