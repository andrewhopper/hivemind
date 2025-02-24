import { PrismaClient, Prisma } from '@prisma/client';
import { execSync } from 'child_process';
import { StrictnessLevel, FactCategory } from '../src/types.js';
import { beforeAll, afterAll, beforeEach } from '@jest/globals';

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
            url: 'file:./test.db?connection_limit=1'
        }
    }
});

// Setup function to run before all tests
beforeAll(async () => {
    // Reset database before tests
    try {
        // Run migrations to ensure schema is up to date
        execSync('npx prisma migrate reset --force', { stdio: 'inherit' });
    } catch (error) {
        console.error('Error setting up test database:', error);
        throw error;
    }
});

// Cleanup after all tests
afterAll(async () => {
    await prisma.$disconnect();
});

// Reset database state before each test
beforeEach(async () => {
    // Reset database before each test
    try {
        execSync('npx prisma migrate reset --force', { stdio: 'inherit' });
    } catch (error) {
        console.error('Error resetting test database:', error);
        throw error;
    }
});

// Export test utilities
export const testUtils = {
    prisma,
    createTestFact: async (data: CreateTestFactData) => {
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
