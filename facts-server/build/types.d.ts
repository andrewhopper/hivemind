export declare enum StrictnessLevel {
    REQUIRED = "REQUIRED",
    RECOMMENDED = "RECOMMENDED",
    OPTIONAL = "OPTIONAL"
}
export interface Condition {
    factId: string;
    type: 'REQUIRES' | 'CONFLICTS_WITH';
}
export interface AcceptanceCriterion {
    id: string;
    description: string;
    validationType: 'MANUAL' | 'AUTOMATED';
    validationScript?: string;
}
export interface FactData {
    content: string;
    strictness: StrictnessLevel;
    type: string;
    minVersion: string;
    maxVersion: string;
    conditions: Condition[];
    acceptanceCriteria: AcceptanceCriterion[];
    createdAt: string;
    updatedAt: string;
}
export interface StorageSearchResult extends FactData {
    id: string;
    applicable: boolean;
}
export interface ValidationResult {
    criterionId: string;
    passed: boolean;
    message?: string;
}
export interface StorageProvider {
    setFact(id: string, content: string, strictness: StrictnessLevel, type: string, minVersion: string, maxVersion: string, conditions: Condition[], acceptanceCriteria: AcceptanceCriterion[]): Promise<void>;
    getFact(id: string): Promise<StorageSearchResult | null>;
    searchFacts(options: {
        type?: string;
        strictness?: StrictnessLevel;
        version?: string;
    }): Promise<StorageSearchResult[]>;
    deleteFact(id: string): Promise<boolean>;
}
