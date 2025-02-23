export class InMemoryStorageProvider {
    constructor() {
        this.facts = new Map();
    }
    async setFact(id, content, strictness, type, minVersion, maxVersion, conditions, acceptanceCriteria) {
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
    async getFact(id) {
        const fact = this.facts.get(id);
        return fact || null;
    }
    async searchFacts(options) {
        const results = [];
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
    async deleteFact(id) {
        return this.facts.delete(id);
    }
}
