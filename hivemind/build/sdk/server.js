export class Server {
    constructor(info, capabilities) {
        this.info = info;
        this.capabilities = capabilities;
        this.transport = null;
        this.handlers = new Map();
    }
    async connect(transport) {
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
    async close() {
        if (this.transport) {
            await this.transport.disconnect();
            this.transport = null;
        }
    }
    setHandler(method, handler) {
        this.handlers.set(method, handler);
    }
}
