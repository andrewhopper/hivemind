import { PrismaClient } from '@prisma/client';
export class PrismaStorageProvider {
    constructor() {
        this.prisma = new PrismaClient();
    }
    async setFact(id, content, strictness, type, category, minVersion, maxVersion, conditions, acceptanceCriteria, contentEmbedding) {
        const data = {
            id,
            content,
            strictness,
            type,
            category,
            minVersion,
            maxVersion,
            content_embedding: contentEmbedding,
            conditions: {
                create: conditions.map(condition => ({
                    type: condition.type,
                    targetId: condition.factId
                }))
            },
            acceptanceCriteria: {
                create: acceptanceCriteria.map(criterion => ({
                    id: criterion.id,
                    description: criterion.description,
                    validationType: criterion.validationType,
                    validationScript: criterion.validationScript
                }))
            }
        };
        await this.prisma.fact.upsert({
            where: { id },
            create: data,
            update: {
                ...data,
                conditions: {
                    deleteMany: {},
                    create: conditions.map(condition => ({
                        type: condition.type,
                        targetId: condition.factId
                    }))
                },
                acceptanceCriteria: {
                    deleteMany: {},
                    create: acceptanceCriteria.map(criterion => ({
                        id: criterion.id,
                        description: criterion.description,
                        validationType: criterion.validationType,
                        validationScript: criterion.validationScript
                    }))
                }
            }
        });
    }
    async getFact(id) {
        const fact = await this.prisma.fact.findUnique({
            where: { id },
            include: {
                conditions: true,
                acceptanceCriteria: true
            }
        });
        if (!fact) {
            return null;
        }
        return {
            id: fact.id,
            content: fact.content,
            strictness: fact.strictness,
            type: fact.type,
            category: fact.category,
            minVersion: fact.minVersion,
            maxVersion: fact.maxVersion,
            conditions: fact.conditions.map((c) => ({
                factId: c.targetId,
                type: c.type
            })),
            acceptanceCriteria: fact.acceptanceCriteria.map((ac) => ({
                id: ac.id,
                description: ac.description,
                validationType: ac.validationType,
                validationScript: ac.validationScript || undefined
            })),
            createdAt: fact.createdAt.toISOString(),
            updatedAt: fact.updatedAt.toISOString(),
            applicable: fact.applicable
        };
    }
    async searchFacts(options) {
        let facts;
        if (options.embedding) {
            // Use raw query for vector similarity search
            const threshold = options.similarityThreshold || 0.8;
            const whereConditions = [];
            const params = [options.embedding, threshold];
            if (options.type) {
                whereConditions.push('f.type = ?');
                params.push(options.type);
            }
            if (options.category) {
                whereConditions.push('f.category = ?');
                params.push(options.category);
            }
            if (options.strictness) {
                whereConditions.push('f.strictness = ?');
                params.push(options.strictness);
            }
            if (options.version) {
                whereConditions.push('f.minVersion <= ? AND f.maxVersion >= ?');
                params.push(options.version, options.version);
            }
            const whereClause = whereConditions.length
                ? 'AND ' + whereConditions.join(' AND ')
                : '';
            const rawResults = await this.prisma.$queryRawUnsafe(`SELECT f.*, 
                       vector_similarity(f.content_embedding, ?) as similarity
                FROM "Fact" f
                WHERE vector_similarity(f.content_embedding, ?) > ?
                ${whereClause}
                ORDER BY similarity DESC`, options.embedding, options.embedding, threshold, ...params);
            // Fetch full fact data including relations
            const factPromises = rawResults.map((result) => this.prisma.fact.findUnique({
                where: { id: result.id },
                include: {
                    conditions: true,
                    acceptanceCriteria: true
                }
            }));
            facts = (await Promise.all(factPromises)).filter((fact) => fact !== null);
        }
        else {
            const where = {};
            if (options.type) {
                where.type = options.type;
            }
            if (options.category) {
                where.category = options.category;
            }
            if (options.strictness) {
                where.strictness = options.strictness;
            }
            if (options.version) {
                where.AND = [
                    { minVersion: { lte: options.version } },
                    { maxVersion: { gte: options.version } }
                ];
            }
            facts = await this.prisma.fact.findMany({
                where,
                include: {
                    conditions: true,
                    acceptanceCriteria: true
                }
            });
        }
        return facts.map(fact => ({
            id: fact.id,
            content: fact.content,
            strictness: fact.strictness,
            type: fact.type,
            category: fact.category,
            minVersion: fact.minVersion,
            maxVersion: fact.maxVersion,
            conditions: fact.conditions.map((c) => ({
                factId: c.targetId,
                type: c.type
            })),
            acceptanceCriteria: fact.acceptanceCriteria.map((ac) => ({
                id: ac.id,
                description: ac.description,
                validationType: ac.validationType,
                validationScript: ac.validationScript || undefined
            })),
            createdAt: fact.createdAt.toISOString(),
            updatedAt: fact.updatedAt.toISOString(),
            applicable: fact.applicable
        }));
    }
    async deleteFact(id) {
        try {
            await this.prisma.fact.delete({
                where: { id }
            });
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async close() {
        await this.prisma.$disconnect();
    }
}
