import { StorageProvider, StorageSearchResult, StrictnessLevel, Condition, AcceptanceCriterion } from './types.js';

export class InMemoryStorageProvider implements StorageProvider {
    private facts: Map<string, StorageSearchResult>;

    constructor() {
        this.facts = new Map();
    }

    async setFact(
        id: string,
        content: string,
        strictness: StrictnessLevel,
        type: string,
        minVersion: string,
        maxVersion: string,
        conditions: Condition[],
        acceptanceCriteria: AcceptanceCriterion[]
    ): Promise<void> {
        const now = new Date().toISOString();
        const existing = this.facts.get(id);

        this.facts.set(id, {
            id,
            content,
            strictness,
            type,
            minVersion,
            maxVersion,
            conditions,
            acceptanceCriteria,
            createdAt: existing?.createdAt || now,
            updatedAt: now,
            applicable: true // Default to true, could be calculated based on conditions
        });
    }

    async getFact(id: string): Promise<StorageSearchResult | null> {
        const fact = this.facts.get(id);
        return fact || null;
    }

    async searchFacts(options: {
        type?: string;
        strictness?: StrictnessLevel;
        version?: string;
    }): Promise<StorageSearchResult[]> {
        const results: StorageSearchResult[] = [];

        for (const fact of this.facts.values()) {
            if (options.type && fact.type !== options.type) {
                continue;
            }

            if (options.strictness && fact.strictness !== options.strictness) {
                continue;
            }

            if (options.version) {
                const version = options.version;
                if (version < fact.minVersion || version > fact.maxVersion) {
                    continue;
                }
            }

            results.push(fact);
        }

        return results;
    }

    async deleteFact(id: string): Promise<boolean> {
        return this.facts.delete(id);
    }
}
