import { PrismaClient } from '@prisma/client';
import { frontendFacts } from './data/frontend.js';
import { backendFacts } from './data/backend.js';
import { databaseFacts } from './data/database.js';
import { architectureFacts } from './data/architecture.js';
import { documentationFacts } from './data/documentation.js';
import { toolingFacts } from './data/tooling.js';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seed...');

    // Clear existing data
    await prisma.acceptanceCriterion.deleteMany();
    await prisma.condition.deleteMany();
    await prisma.fact.deleteMany();

    console.log('Cleared existing data');

    // Seed all facts
    const allFacts = [
        ...frontendFacts,
        ...backendFacts,
        ...databaseFacts,
        ...architectureFacts,
        ...documentationFacts,
        ...toolingFacts
    ];

    for (const fact of allFacts) {
        await prisma.fact.create({
            data: fact
        });
        console.log(`Created fact: ${fact.id}`);
    }

    console.log('Seeding complete!');
}

main()
    .catch((e) => {
        console.error('Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
