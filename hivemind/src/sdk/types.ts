export interface ServerRequest {
    method: string;
    params?: Record<string, unknown>;
}

export interface ServerResponse {
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}

export interface ServerCapabilities {
    tools?: Record<string, {
        description: string;
        inputSchema: {
            type: string;
            properties: Record<string, unknown>;
            required?: string[];
        };
    }>;
}

export interface ServerInfo {
    name: string;
    version: string;
}

export interface ServerTransport {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    onRequest(handler: (request: ServerRequest) => Promise<ServerResponse>): void;
}

// MCP Error codes
export enum ErrorCode {
    ParseError = -32700,
    InvalidRequest = -32600,
    MethodNotFound = -32601,
    InvalidParams = -32602,
    InternalError = -32603
}

// MCP Error class
export class McpError extends Error {
    code: ErrorCode;

    constructor(code: ErrorCode, message: string) {
        super(message);
        this.code = code;
        this.name = 'McpError';
    }
}

// Schema constants
export const ListToolsRequestSchema = 'list_tools';
export const CallToolRequestSchema = 'call_tool';
