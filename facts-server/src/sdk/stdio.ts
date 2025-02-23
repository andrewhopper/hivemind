import { ServerRequest, ServerResponse, ServerTransport } from './types.js';
import { createInterface } from 'readline';

export class StdioServerTransport implements ServerTransport {
    private requestHandler: ((request: ServerRequest) => Promise<ServerResponse>) | null = null;
    private readline = createInterface({
        input: process.stdin,
        output: process.stdout
    });

    async connect(): Promise<void> {
        this.readline.on('line', async (line) => {
            try {
                const request = JSON.parse(line) as ServerRequest;
                if (this.requestHandler) {
                    const response = await this.requestHandler(request);
                    console.log(JSON.stringify(response));
                }
            } catch (error) {
                console.error('Error processing request:', error);
                console.log(JSON.stringify({
                    content: [{ type: 'text', text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
                    isError: true
                }));
            }
        });
    }

    async disconnect(): Promise<void> {
        this.readline.close();
    }

    onRequest(handler: (request: ServerRequest) => Promise<ServerResponse>): void {
        this.requestHandler = handler;
    }
}
