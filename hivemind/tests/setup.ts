import { PrismaClient, Prisma } from '@prisma/client';
import { execSync } from 'child_process';
import { StrictnessLevel, FactCategory } from '../src/types.js';
import { beforeAll, afterAll, beforeEach } from '@jest/globals';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';

type CreateTestFactData = Partial<
    Omit<Prisma.FactCreateInput, 'strictness' | 'category'> & {
        strictness?: StrictnessLevel;
        category?: FactCategory;
    }
>;

// Ensure test database directory exists
const TEST_DB_DIR = join(process.cwd(), 'prisma');
const TEST_DB_PATH = join(TEST_DB_DIR, 'test.db');

if (!existsSync(TEST_DB_DIR)) {
    mkdirSync(TEST_DB_DIR, { recursive: true });
}

// Create a singleton PrismaClient for tests
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: `file:${TEST_DB_PATH}`
        }
    }
});

// Setup function to run before all tests
beforeAll(async () => {
    // Reset database before tests
    try {
        // Set DATABASE_URL for migrations
        process.env.DATABASE_URL = `file:${TEST_DB_PATH}`;

        // Run migrations
        execSync('npx prisma migrate reset --force', {
            stdio: 'inherit',
            env: {
                ...process.env,
                DATABASE_URL: `file:${TEST_DB_PATH}`
            }
        });
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
    try {
        // Clear all data but keep the schema
        await prisma.fact.deleteMany();
    } catch (error) {
        console.error('Error clearing test data:', error);
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
                strictness: data.strictness || StrictnessLevel.MODERATE,
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
        await prisma.fact.deleteMany();
    }
};
