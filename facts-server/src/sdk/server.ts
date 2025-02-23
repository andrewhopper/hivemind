import { ServerRequest, ServerResponse, ServerInfo, ServerCapabilities, ServerTransport } from './types.js';

export class Server {
    private transport: ServerTransport | null = null;
    private handlers: Map<string, (request: ServerRequest) => Promise<ServerResponse>> = new Map();

    constructor(
        private info: ServerInfo,
        private capabilities: { capabilities: ServerCapabilities }
    ) { }

    async connect(transport: ServerTransport): Promise<void> {
        this.transport = transport;
        transport.onRequest(async (request) => {
            const handler = this.handlers.get(request.method);
            if (!handler) {
                return {
                    content: [{ type: 'text', text: `Unknown method: ${request.method}` }],
                    isError: true
                };
            }
            return handler(request);
        });
        await transport.connect();
    }

    async close(): Promise<void> {
        if (this.transport) {
            await this.transport.disconnect();
            this.transport = null;
        }
    }

    setHandler(method: string, handler: (request: ServerRequest) => Promise<ServerResponse>): void {
        this.handlers.set(method, handler);
    }
}
