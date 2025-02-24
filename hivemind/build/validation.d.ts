import { AcceptanceCriterion, ValidationResult } from './types.js';
export declare class ValidationError extends Error {
    constructor(message: string);
}
export declare function validateCriteria(content: string, criteria: AcceptanceCriterion[]): Promise<ValidationResult[]>;
export declare function validateFactConditions(factConditions: Map<string, boolean>, conditions: {
    factId: string;
    type: 'REQUIRES' | 'CONFLICTS_WITH';
}[]): boolean;
