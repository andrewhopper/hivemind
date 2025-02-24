interface Fact {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

// Temporary mock function - replace with actual API call later
export async function getAllFacts(): Promise<Fact[]> {
    // Mock data for now
    return [
        {
            id: "1",
            title: "Example Fact",
            description: "This is a sample fact",
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ];
}

export async function getFact(id: string): Promise<Fact | null> {
    const facts = await getAllFacts();
    return facts.find(fact => fact.id === id) || null;
} 