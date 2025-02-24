import { StrictnessLevel, FactCategory, Condition, AcceptanceCriterion, ConditionType, ValidationType } from '../../src/types.js';
import { Prisma } from '@prisma/client';
import '@testing-library/jest-dom';
import { describe, expect, it } from '@jest/globals';

describe('Type System', () => {
    describe('Enums', () => {
        it('should have matching StrictnessLevel values', () => {
            expect(StrictnessLevel.REQUIRED).toBe('REQUIRED');
            expect(StrictnessLevel.RECOMMENDED).toBe('RECOMMENDED');
            expect(StrictnessLevel.OPTIONAL).toBe('OPTIONAL');
        });

        it('should have all required FactCategory values', () => {
            // Test core categories
            expect(FactCategory.FRONTEND).toBe('FRONTEND');
            expect(FactCategory.BACKEND).toBe('BACKEND');
            expect(FactCategory.DATABASE).toBe('DATABASE');
            expect(FactCategory.FULL_STACK).toBe('FULL_STACK');

            // Test pattern categories
            expect(FactCategory.DESIGN_PATTERN).toBe('DESIGN_PATTERN');
            expect(FactCategory.ARCHITECTURE_PATTERN).toBe('ARCHITECTURE_PATTERN');
            expect(FactCategory.TESTING_PATTERN).toBe('TESTING_PATTERN');

            // Test organization categories
            expect(FactCategory.NAMING_CONVENTION).toBe('NAMING_CONVENTION');
            expect(FactCategory.PROJECT_STRUCTURE).toBe('PROJECT_STRUCTURE');
            expect(FactCategory.CODE_STYLE).toBe('CODE_STYLE');
        });
    });

    describe('Type Compatibility', () => {
        it('should allow assigning custom types to Prisma types', () => {
            const condition: Condition = {
                factId: 'test-fact',
                type: 'REQUIRES'
            };

            const criterion: AcceptanceCriterion = {
                id: 'test-criterion',
                description: 'Test criterion',
                validationType: 'MANUAL'
            };

            // These assertions verify the types are compatible
            expect(condition.factId).toBe('test-fact');
            expect(criterion.validationType).toBe('MANUAL');
        });

        it('should handle Prisma fact creation with custom types', () => {
            const factData: Prisma.FactCreateInput = {
                id: 'test-fact',
                content: 'Test content',
                strictness: StrictnessLevel.REQUIRED,
                type: 'test',
                category: FactCategory.TESTING_PATTERN,
                minVersion: '1.0.0',
                maxVersion: '*',
                conditions: {
                    create: [
                        {
                            type: 'REQUIRES',
                            targetId: 'dependency-fact'
                        }
                    ]
                },
                acceptanceCriteria: {
                    create: [
                        {
                            description: 'Test criterion',
                            validationType: 'MANUAL'
                        }
                    ]
                }
            };

            // Type assertion test - if this compiles, types are compatible
            expect(factData.strictness).toBe(StrictnessLevel.REQUIRED);
            expect(factData.category).toBe(FactCategory.TESTING_PATTERN);
        });
    });

    describe('Type Guards', () => {
        it('should validate StrictnessLevel values', () => {
            const validValues = ['REQUIRED', 'RECOMMENDED', 'OPTIONAL'];
            const invalidValue = 'INVALID';

            validValues.forEach(value => {
                expect(Object.values(StrictnessLevel)).toContain(value);
            });

            expect(Object.values(StrictnessLevel)).not.toContain(invalidValue);
        });

        it('should validate FactCategory values', () => {
            const validCategories = [
                'FRONTEND',
                'BACKEND',
                'DATABASE',
                'TESTING_PATTERN'
            ];
            const invalidCategory = 'INVALID_CATEGORY';

            validCategories.forEach(category => {
                expect(Object.values(FactCategory)).toContain(category);
            });

            expect(Object.values(FactCategory)).not.toContain(invalidCategory);
        });
    });

    describe('Type Definitions', () => {
        it('should have correct Condition type structure', () => {
            const condition: Condition = {
                factId: 'test-fact',
                type: 'REQUIRES'
            };

            expect(condition).toHaveProperty('factId');
            expect(condition).toHaveProperty('type');
            expect(Object.keys(condition)).toHaveLength(2);
        });

        it('should have correct AcceptanceCriterion type structure', () => {
            const criterion: AcceptanceCriterion = {
                id: 'test-criterion',
                description: 'Test description',
                validationType: 'AUTOMATED',
                validationScript: 'npm test'
            };

            expect(criterion).toHaveProperty('id');
            expect(criterion).toHaveProperty('description');
            expect(criterion).toHaveProperty('validationType');
            expect(criterion).toHaveProperty('validationScript');
            expect(Object.keys(criterion)).toHaveLength(4);
        });
    });
});
