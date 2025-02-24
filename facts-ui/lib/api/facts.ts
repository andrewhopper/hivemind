import prisma from '@/lib/prisma'

export async function getAllFacts() {
    const facts = await prisma.fact.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    })
    return facts
} 