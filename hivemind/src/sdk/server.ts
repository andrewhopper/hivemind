export class Server {
    private info: any;
    private capabilities: any;
    private transport: any;
    private handlers: Map<string, any>;

    constructor(info: any, capabilities: any) {
        this.info = info;
        this.capabilities = capabilities;
        this.transport = null;
        this.handlers = new Map();
    }

    async connect(transport: any) {
        this.transport = transport;
        transport.onRequest(async (request: any) => {
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

    async close() {
        if (this.transport) {
            await this.transport.disconnect();
            this.transport = null;
        }
    }

    setRequestHandler(method: string, handler: any) {
        this.handlers.set(method, handler);
    }
}
