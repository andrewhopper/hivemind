import { StorageProvider, StorageSearchResult, StrictnessLevel, Condition, AcceptanceCriterion } from './types.js';
export declare class InMemoryStorageProvider implements StorageProvider {
    private facts;
    constructor();
    setFact(id: string, content: string, strictness: StrictnessLevel, type: string, minVersion: string, maxVersion: string, conditions: Condition[], acceptanceCriteria: AcceptanceCriterion[]): Promise<void>;
    getFact(id: string): Promise<StorageSearchResult | null>;
    searchFacts(options: {
        type?: string;
        strictness?: StrictnessLevel;
        version?: string;
    }): Promise<StorageSearchResult[]>;
    deleteFact(id: string): Promise<boolean>;
}
