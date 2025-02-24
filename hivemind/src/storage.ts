import { PrismaClient, Prisma } from '@prisma/client';
import { StorageProvider, StorageSearchResult, StrictnessLevel, FactCategory, Condition, AcceptanceCriterion } from './types.js';

export class PrismaStorageProvider implements StorageProvider {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async setFact(
        id: string,
        content: string,
        strictness: StrictnessLevel,
        type: string,
        category: FactCategory,
        minVersion: string,
        maxVersion: string,
        conditions: Condition[],
        acceptanceCriteria: AcceptanceCriterion[],
        contentEmbedding?: string
    ): Promise<void> {
        const data: Prisma.FactCreateInput | Prisma.FactUpdateInput = {
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
            create: data as Prisma.FactCreateInput,
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

    async getFact(id: string): Promise<StorageSearchResult | null> {
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
            strictness: fact.strictness as StrictnessLevel,
            type: fact.type,
            category: fact.category as FactCategory,
            minVersion: fact.minVersion,
            maxVersion: fact.maxVersion,
            conditions: fact.conditions.map(c => ({
                factId: c.targetId,
                type: c.type as 'REQUIRES' | 'CONFLICTS_WITH'
            })),
            acceptanceCriteria: fact.acceptanceCriteria.map(ac => ({
                id: ac.id,
                description: ac.description,
                validationType: ac.validationType as 'MANUAL' | 'AUTOMATED',
                validationScript: ac.validationScript || undefined
            })),
            createdAt: fact.createdAt.toISOString(),
            updatedAt: fact.updatedAt.toISOString(),
            applicable: fact.applicable
        };
    }

    async searchFacts(options: {
        type?: string;
        category?: FactCategory;
        strictness?: StrictnessLevel;
        version?: string;
        embedding?: string;
        similarityThreshold?: number;
    }): Promise<StorageSearchResult[]> {
        let facts;

        if (options.embedding) {
            // Use raw query for vector similarity search
            const threshold = options.similarityThreshold || 0.8;
            const whereConditions = [];
            const params: any[] = [options.embedding, threshold];

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

            const rawResults = await this.prisma.$queryRawUnsafe<Array<{ id: string }>>(
                `SELECT f.*, 
                       vector_similarity(f.content_embedding, ?) as similarity
                FROM "Fact" f
                WHERE vector_similarity(f.content_embedding, ?) > ?
                ${whereClause}
                ORDER BY similarity DESC`,
                options.embedding,
                options.embedding,
                threshold,
                ...params
            );

            // Fetch full fact data including relations
            const factPromises = rawResults.map(result =>
                this.prisma.fact.findUnique({
                    where: { id: result.id },
                    include: {
                        conditions: true,
                        acceptanceCriteria: true
                    }
                })
            );

            facts = (await Promise.all(factPromises)).filter((fact): fact is NonNullable<typeof fact> => fact !== null);
        } else {
            const where: Prisma.FactWhereInput = {};

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
            strictness: fact.strictness as StrictnessLevel,
            type: fact.type,
            category: fact.category as FactCategory,
            minVersion: fact.minVersion,
            maxVersion: fact.maxVersion,
            conditions: fact.conditions.map(c => ({
                factId: c.targetId,
                type: c.type as 'REQUIRES' | 'CONFLICTS_WITH'
            })),
            acceptanceCriteria: fact.acceptanceCriteria.map(ac => ({
                id: ac.id,
                description: ac.description,
                validationType: ac.validationType as 'MANUAL' | 'AUTOMATED',
                validationScript: ac.validationScript || undefined
            })),
            createdAt: fact.createdAt.toISOString(),
            updatedAt: fact.updatedAt.toISOString(),
            applicable: fact.applicable
        }));
    }

    async deleteFact(id: string): Promise<boolean> {
        try {
            await this.prisma.fact.delete({
                where: { id }
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async close(): Promise<void> {
        await this.prisma.$disconnect();
    }
}
