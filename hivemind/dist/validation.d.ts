import { AcceptanceCriterion, ValidationResult, Fact } from './types.js';
export declare class ValidationError extends Error {
    constructor(message: string);
}
export declare function validateCriteria(content: string, criteria: AcceptanceCriterion[]): Promise<ValidationResult[]>;
export interface ValidationResponse {
    isValid: boolean;
    errors: string[];
}
export declare function validateFact(fact: Fact, version?: string): Promise<ValidationResponse>;
export declare function validateConditions(factId: string): Promise<ValidationResponse>;
export declare function validateFactConditions(factConditions: Map<string, boolean>, conditions: {
    factId: string;
    type: 'REQUIRES' | 'CONFLICTS_WITH';
}[]): boolean;
