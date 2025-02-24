import { testUtils } from '../setup.js';
import { validateFact, validateConditions } from '../../src/validation.js';
import { StrictnessLevel, FactCategory } from '../../src/types.js';
import type { Prisma } from '@prisma/client';

type FactCreateInput = Prisma.FactCreateInput & {
    strictness: StrictnessLevel;
    category: FactCategory;
};

describe('Validation', () => {
    describe('Fact Validation', () => {
        it('should validate a fact with all required fields', async () => {
            const fact = await testUtils.createTestFact({
                id: 'valid-fact',
                content: 'Valid fact content',
                strictness: StrictnessLevel.REQUIRED,
                type: 'test',
                category: FactCategory.TESTING_PATTERN,
                minVersion: '1.0.0',
                maxVersion: '2.0.0'
            });

            const validation = await validateFact(fact);
            expect(validation.isValid).toBe(true);
            expect(validation.errors).toHaveLength(0);
        });

        it('should fail validation for missing required fields', async () => {
            const invalidFact: Partial<FactCreateInput> = {
                id: 'invalid-fact',
                // Missing content
                strictness: StrictnessLevel.REQUIRED,
                type: 'test'
                // Missing category
            };

            const validation = await validateFact(invalidFact);
            expect(validation.isValid).toBe(false);
            expect(validation.errors).toContain('Missing required field: content');
            expect(validation.errors).toContain('Missing required field: category');
        });

        it('should validate version compatibility', async () => {
            const fact = await testUtils.createTestFact({
                id: 'version-test',
                minVersion: '2.0.0',
                maxVersion: '3.0.0'
            });

            const validVersion = await validateFact(fact, '2.5.0');
            expect(validVersion.isValid).toBe(true);

            const invalidVersion = await validateFact(fact, '1.0.0');
            expect(invalidVersion.isValid).toBe(false);
            expect(invalidVersion.errors).toContain('Version 1.0.0 is not compatible (requires >=2.0.0 <3.0.0)');
        });
    });

    describe('Condition Validation', () => {
        it('should validate fact with satisfied conditions', async () => {
            // Create dependency fact
            const dependencyFact = await testUtils.createTestFact({
                id: 'dependency-fact',
                applicable: true
            });

            // Create fact that requires the dependency
            const fact = await testUtils.createTestFact({
                id: 'dependent-fact',
                conditions: {
                    create: [
                        {
                            type: 'REQUIRES',
                            targetId: dependencyFact.id
                        }
                    ]
                }
            });

            const validation = await validateConditions(fact.id);
            expect(validation.isValid).toBe(true);
            expect(validation.errors).toHaveLength(0);
        });

        it('should fail validation when required fact is not applicable', async () => {
            // Create dependency fact that is not applicable
            const dependencyFact = await testUtils.createTestFact({
                id: 'inactive-dependency',
                applicable: false
            });

            // Create fact that requires the dependency
            const fact = await testUtils.createTestFact({
                id: 'dependent-fact-2',
                conditions: {
                    create: [
                        {
                            type: 'REQUIRES',
                            targetId: dependencyFact.id
                        }
                    ]
                }
            });

            const validation = await validateConditions(fact.id);
            expect(validation.isValid).toBe(false);
            expect(validation.errors).toContain(`Required fact '${dependencyFact.id}' is not applicable`);
        });

        it('should handle conflicting facts', async () => {
            // Create conflicting fact
            const conflictingFact = await testUtils.createTestFact({
                id: 'conflicting-fact',
                applicable: true
            });

            // Create fact that conflicts with the other fact
            const fact = await testUtils.createTestFact({
                id: 'fact-with-conflict',
                conditions: {
                    create: [
                        {
                            type: 'CONFLICTS_WITH',
                            targetId: conflictingFact.id
                        }
                    ]
                }
            });

            const validation = await validateConditions(fact.id);
            expect(validation.isValid).toBe(false);
            expect(validation.errors).toContain(`Fact conflicts with active fact '${conflictingFact.id}'`);
        });
    });

    describe('Acceptance Criteria Validation', () => {
        it('should validate fact with passing acceptance criteria', async () => {
            const fact = await testUtils.createTestFact({
                id: 'fact-with-criteria',
                acceptanceCriteria: {
                    create: [
                        {
                            description: 'Test criterion',
                            validationType: 'AUTOMATED',
                            validationScript: 'exit 0' // Script that always succeeds
                        }
                    ]
                }
            });

            const validation = await validateFact(fact);
            expect(validation.isValid).toBe(true);
            expect(validation.errors).toHaveLength(0);
        });

        it('should fail validation when acceptance criteria fails', async () => {
            const fact = await testUtils.createTestFact({
                id: 'fact-failing-criteria',
                acceptanceCriteria: {
                    create: [
                        {
                            description: 'Failing criterion',
                            validationType: 'AUTOMATED',
                            validationScript: 'exit 1' // Script that always fails
                        }
                    ]
                }
            });

            const validation = await validateFact(fact);
            expect(validation.isValid).toBe(false);
            expect(validation.errors).toContain('Acceptance criterion "Failing criterion" failed validation');
        });
    });

    describe('Complex Validation Scenarios', () => {
        it('should validate fact with multiple conditions and criteria', async () => {
            // Create multiple dependency facts
            const dep1 = await testUtils.createTestFact({ id: 'dep-1', applicable: true });
            const dep2 = await testUtils.createTestFact({ id: 'dep-2', applicable: true });
            const conflict = await testUtils.createTestFact({ id: 'conflict', applicable: false });

            // Create fact with multiple conditions and criteria
            const fact = await testUtils.createTestFact({
                id: 'complex-fact',
                conditions: {
                    create: [
                        { type: 'REQUIRES', targetId: dep1.id },
                        { type: 'REQUIRES', targetId: dep2.id },
                        { type: 'CONFLICTS_WITH', targetId: conflict.id }
                    ]
                },
                acceptanceCriteria: {
                    create: [
                        {
                            description: 'First criterion',
                            validationType: 'AUTOMATED',
                            validationScript: 'exit 0'
                        },
                        {
                            description: 'Second criterion',
                            validationType: 'MANUAL'
                        }
                    ]
                }
            });

            const validation = await validateFact(fact);
            expect(validation.isValid).toBe(true);
            expect(validation.errors).toHaveLength(0);
        });
    });
});
