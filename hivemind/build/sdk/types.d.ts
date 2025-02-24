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
