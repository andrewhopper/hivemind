import { Fact, FactFormData } from "../types/facts"

const MCP_SERVER = "facts"

async function mcpRequest<T, Args extends Record<string, unknown>>(tool: string, args: Args): Promise<T> {
    const response = await fetch("/api/mcp", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            server: MCP_SERVER,
            tool,
            args,
        }),
    })

    if (!response.ok) {
        throw new Error(`MCP request failed: ${response.statusText}`)
    }

    const data = await response.json()
    return data
}

export async function getAllFacts(): Promise<Fact[]> {
    return mcpRequest<Fact[], Record<string, never>>("get_all_facts", {})
}

export async function getFact(id: string): Promise<Fact | null> {
    return mcpRequest<Fact | null, { id: string }>("get_fact", { id })
}

export async function searchFacts(params: {
    type?: string
    strictness?: string
    version?: string
}): Promise<Fact[]> {
    return mcpRequest<Fact[], typeof params>("search_facts", params)
}

export async function createFact(data: FactFormData): Promise<void> {
    await mcpRequest<void, FactFormData>("set_fact", data)
}

export async function updateFact(id: string, data: FactFormData): Promise<void> {
    await mcpRequest<void, FactFormData & { id: string }>("set_fact", { ...data, id })
}

export async function validateFact(factId: string, content: string): Promise<{
    passed: boolean
    message?: string
}> {
    return mcpRequest<{ passed: boolean; message?: string }, { factId: string; content: string }>("validate_criteria", { factId, content })
}
