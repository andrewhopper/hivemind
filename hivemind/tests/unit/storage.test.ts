import { testUtils } from '../setup.js';
import { Prisma } from '@prisma/client';
import { StrictnessLevel, FactCategory } from '../../src/types.js';

describe('Storage Operations', () => {
    describe('Facts', () => {
        it('should create a fact with basic fields', async () => {
            const fact = await testUtils.createTestFact({
                id: 'test-basic-fact',
                content: 'Test fact content',
                strictness: StrictnessLevel.REQUIRED,
                type: 'test',
                category: FactCategory.TESTING_PATTERN
            });

            expect(fact).toBeDefined();
            expect(fact.id).toBe('test-basic-fact');
            expect(fact.strictness).toBe('REQUIRED');
        });

        it('should create a fact with conditions', async () => {
            const fact = await testUtils.createTestFact({
                id: 'test-fact-with-conditions',
                conditions: {
                    create: [
                        {
                            type: 'REQUIRES',
                            targetId: 'dependency-fact'
                        }
                    ]
                }
            });

            const factWithConditions = await testUtils.prisma.fact.findUnique({
                where: { id: fact.id },
                include: { conditions: true }
            });

            expect(factWithConditions?.conditions).toHaveLength(1);
            expect(factWithConditions?.conditions[0].type).toBe('REQUIRES');
            expect(factWithConditions?.conditions[0].targetId).toBe('dependency-fact');
        });

        it('should create a fact with acceptance criteria', async () => {
            const fact = await testUtils.createTestFact({
                id: 'test-fact-with-criteria',
                acceptanceCriteria: {
                    create: [
                        {
                            description: 'Test criterion',
                            validationType: 'MANUAL'
                        }
                    ]
                }
            });

            const factWithCriteria = await testUtils.prisma.fact.findUnique({
                where: { id: fact.id },
                include: { acceptanceCriteria: true }
            });

            expect(factWithCriteria?.acceptanceCriteria).toHaveLength(1);
            expect(factWithCriteria?.acceptanceCriteria[0].description).toBe('Test criterion');
            expect(factWithCriteria?.acceptanceCriteria[0].validationType).toBe('MANUAL');
        });

        it('should update a fact', async () => {
            const fact = await testUtils.createTestFact({
                id: 'test-update-fact'
            });

            const updatedFact = await testUtils.prisma.fact.update({
                where: { id: fact.id },
                data: {
                    content: 'Updated content',
                    strictness: 'REQUIRED'
                }
            });

            expect(updatedFact.content).toBe('Updated content');
            expect(updatedFact.strictness).toBe('REQUIRED');
        });

        it('should delete a fact and its related records', async () => {
            const fact = await testUtils.createTestFact({
                id: 'test-delete-fact',
                conditions: {
                    create: [{ type: 'REQUIRES', targetId: 'other-fact' }]
                },
                acceptanceCriteria: {
                    create: [{ description: 'Test', validationType: 'MANUAL' }]
                }
            });

            await testUtils.prisma.fact.delete({
                where: { id: fact.id }
            });

            const deletedFact = await testUtils.prisma.fact.findUnique({
                where: { id: fact.id }
            });
            const conditions = await testUtils.prisma.condition.findMany({
                where: { factId: fact.id }
            });
            const criteria = await testUtils.prisma.acceptanceCriterion.findMany({
                where: { factId: fact.id }
            });

            expect(deletedFact).toBeNull();
            expect(conditions).toHaveLength(0);
            expect(criteria).toHaveLength(0);
        });
    });

    describe('Conditions', () => {
        it('should create and verify condition relationships', async () => {
            // Create two facts
            const fact1 = await testUtils.createTestFact({ id: 'fact-1' });
            const fact2 = await testUtils.createTestFact({ id: 'fact-2' });

            // Create relationship
            await testUtils.prisma.condition.create({
                data: {
                    factId: fact1.id,
                    type: 'REQUIRES',
                    targetId: fact2.id
                }
            });

            const factWithConditions = await testUtils.prisma.fact.findUnique({
                where: { id: fact1.id },
                include: { conditions: true }
            });

            expect(factWithConditions?.conditions).toHaveLength(1);
            expect(factWithConditions?.conditions[0].targetId).toBe(fact2.id);
        });
    });

    describe('Acceptance Criteria', () => {
        it('should create and verify acceptance criteria', async () => {
            const fact = await testUtils.createTestFact({ id: 'fact-with-criteria' });

            await testUtils.prisma.acceptanceCriterion.create({
                data: {
                    factId: fact.id,
                    description: 'Must pass all tests',
                    validationType: 'AUTOMATED',
                    validationScript: 'npm test'
                }
            });

            const factWithCriteria = await testUtils.prisma.fact.findUnique({
                where: { id: fact.id },
                include: { acceptanceCriteria: true }
            });

            expect(factWithCriteria?.acceptanceCriteria).toHaveLength(1);
            expect(factWithCriteria?.acceptanceCriteria[0].validationType).toBe('AUTOMATED');
            expect(factWithCriteria?.acceptanceCriteria[0].validationScript).toBe('npm test');
        });
    });

    describe('Error Handling', () => {
        it('should handle duplicate fact IDs', async () => {
            await testUtils.createTestFact({ id: 'duplicate-fact' });

            await expect(
                testUtils.createTestFact({ id: 'duplicate-fact' })
            ).rejects.toThrow(Prisma.PrismaClientKnownRequestError);
        });

        it('should handle invalid condition references', async () => {
            const fact = await testUtils.createTestFact({ id: 'fact-invalid-condition' });

            await expect(
                testUtils.prisma.condition.create({
                    data: {
                        factId: fact.id,
                        type: 'REQUIRES',
                        targetId: 'non-existent-fact'
                    }
                })
            ).rejects.toThrow();
        });
    });
});
