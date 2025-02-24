import { Fact, FactFormData } from "../types/facts"
import prisma from "@/lib/prisma"

export async function getAllFacts(): Promise<Fact[]> {
    return prisma.fact.findMany({
        include: {
            conditions: true,
            acceptanceCriteria: true
        }
    })
}

export async function getFact(id: string): Promise<Fact | null> {
    return prisma.fact.findUnique({
        where: { id },
        include: {
            conditions: true,
            acceptanceCriteria: true
        }
    })
}

export async function searchFacts(params: {
    type?: string
    strictness?: string
    version?: string
}): Promise<Fact[]> {
    const { type, strictness, version } = params
    return prisma.fact.findMany({
        where: {
            ...(type && { type }),
            ...(strictness && { strictness }),
            ...(version && {
                OR: [
                    { minVersion: { lte: version } },
                    { minVersion: null }
                ],
                AND: [
                    { maxVersion: { gte: version } },
                    { maxVersion: { not: null } }
                ]
            })
        },
        include: {
            conditions: true,
            acceptanceCriteria: true
        }
    })
}

export async function createFact(data: FactFormData): Promise<void> {
    await prisma.fact.create({
        data: {
            ...data,
            conditions: {
                create: data.conditions || []
            },
            acceptanceCriteria: {
                create: data.acceptanceCriteria || []
            }
        }
    })
}

export async function updateFact(id: string, data: FactFormData): Promise<void> {
    await prisma.fact.update({
        where: { id },
        data: {
            ...data,
            conditions: {
                deleteMany: {},
                create: data.conditions || []
            },
            acceptanceCriteria: {
                deleteMany: {},
                create: data.acceptanceCriteria || []
            }
        }
    })
}

export async function validateFact(factId: string, content: string): Promise<{
    passed: boolean
    message?: string
}> {
    const fact = await prisma.fact.findUnique({
        where: { id: factId },
        include: { acceptanceCriteria: true }
    })

    if (!fact) {
        return {
            passed: false,
            message: "Fact not found"
        }
    }

    // For now, just check if content exists
    return {
        passed: !!content,
        message: content ? "Content provided" : "Content is required"
    }
}
