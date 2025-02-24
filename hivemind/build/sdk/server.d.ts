import { ServerRequest, ServerResponse, ServerInfo, ServerCapabilities, ServerTransport } from './types.js';
export declare class Server {
    private info;
    private capabilities;
    private transport;
    private handlers;
    constructor(info: ServerInfo, capabilities: {
        capabilities: ServerCapabilities;
    });
    connect(transport: ServerTransport): Promise<void>;
    close(): Promise<void>;
    setHandler(method: string, handler: (request: ServerRequest) => Promise<ServerResponse>): void;
}
