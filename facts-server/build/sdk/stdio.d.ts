import { ServerRequest, ServerResponse, ServerTransport } from './types.js';
export declare class StdioServerTransport implements ServerTransport {
    private requestHandler;
    private readline;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    onRequest(handler: (request: ServerRequest) => Promise<ServerResponse>): void;
}
