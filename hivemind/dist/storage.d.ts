import { StorageProvider, StorageSearchResult, StrictnessLevel, FactCategory, Condition, AcceptanceCriterion } from './types.js';
export declare class PrismaStorageProvider implements StorageProvider {
    private prisma;
    constructor();
    setFact(id: string, content: string, strictness: StrictnessLevel, type: string, category: FactCategory, minVersion: string, maxVersion: string, conditions: Condition[], acceptanceCriteria: AcceptanceCriterion[], contentEmbedding?: string): Promise<void>;
    getFact(id: string): Promise<StorageSearchResult | null>;
    searchFacts(options: {
        type?: string;
        category?: FactCategory;
        strictness?: StrictnessLevel;
        version?: string;
        embedding?: string;
        similarityThreshold?: number;
    }): Promise<StorageSearchResult[]>;
    deleteFact(id: string): Promise<boolean>;
    close(): Promise<void>;
}
