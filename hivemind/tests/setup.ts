import { PrismaClient, Prisma } from '@prisma/client';
import { execSync } from 'child_process';
import { StrictnessLevel, FactCategory } from '../src/types.js';

type CreateTestFactData = Partial<
    Omit<Prisma.FactCreateInput, 'strictness' | 'category'> & {
        strictness?: StrictnessLevel;
        category?: FactCategory;
    }
>;

// Create a singleton PrismaClient for tests
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: 'file:./test.db'
        }
    }
});

// Setup function to run before all tests
beforeAll(async () => {
    // Reset database before tests
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS Fact');
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS Condition');
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS AcceptanceCriterion');

    // Run migrations
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
});

// Cleanup after all tests
afterAll(async () => {
    await prisma.$disconnect();
});

// Reset database state before each test
beforeEach(async () => {
    await prisma.acceptanceCriterion.deleteMany();
    await prisma.condition.deleteMany();
    await prisma.fact.deleteMany();
});

// Export test utilities
export const testUtils = {
    prisma,
    createTestFact: async (data: CreateTestFactData): Promise<Prisma.Fact> => {
        return await prisma.fact.create({
            data: {
                id: data.id || 'test-fact',
                content: data.content || 'Test fact content',
                strictness: data.strictness || StrictnessLevel.RECOMMENDED,
                type: data.type || 'test',
                category: data.category || FactCategory.TESTING_PATTERN,
                minVersion: data.minVersion || '1.0.0',
                maxVersion: data.maxVersion || '*',
                applicable: data.applicable ?? true,
                conditions: data.conditions,
                acceptanceCriteria: data.acceptanceCriteria
            }
        });
    },
    clearDatabase: async () => {
        await prisma.acceptanceCriterion.deleteMany();
        await prisma.condition.deleteMany();
        await prisma.fact.deleteMany();
    }
};
