import { Server } from "@modelcontextprotocol/sdk/server"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { server, tool, args } = body

        if (server !== "facts") {
            return Response.json({ error: "Invalid MCP server" }, { status: 400 })
        }

        const mcpServer = new Server(
            {
                name: "facts-server",
                version: "0.1.0",
            },
            {
                capabilities: {
                    tools: {},
                },
            }
        )

        const transport = new StdioServerTransport()
        await mcpServer.connect(transport)

        const result = await mcpServer.callTool(tool, args)
        return Response.json(result)
    } catch (error) {
        console.error("MCP error:", error)
        return Response.json(
            { error: "Failed to process MCP request" },
            { status: 500 }
        )
    }
}
