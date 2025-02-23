import { createInterface } from 'readline';
export class StdioServerTransport {
    constructor() {
        this.requestHandler = null;
        this.readline = createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }
    async connect() {
        this.readline.on('line', async (line) => {
            try {
                const request = JSON.parse(line);
                if (this.requestHandler) {
                    const response = await this.requestHandler(request);
                    console.log(JSON.stringify(response));
                }
            }
            catch (error) {
                console.error('Error processing request:', error);
                console.log(JSON.stringify({
                    content: [{ type: 'text', text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
                    isError: true
                }));
            }
        });
    }
    async disconnect() {
        this.readline.close();
    }
    onRequest(handler) {
        this.requestHandler = handler;
    }
}
