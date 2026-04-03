import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

async function test() {
  const url = process.env.DATABASE_URL;
  console.log('Testing with various constructor options for URL:', url);
  
  const options = [
    { datasourceUrl: url },
    { datasources: { db: { url } } }
  ];

  for (const opt of options) {
    try {
      console.log(`\n--- Testing option: ${JSON.stringify(opt)} ---`);
      const prisma = new PrismaClient(opt as any);
      await prisma.$connect();
      console.log('SUCCESS with this option');
      await prisma.$disconnect();
      return;
    } catch (e: any) {
      console.error(`FAILED with this option: ${e.message}`);
    }
  }
}

test();
