export declare class StdioServerTransport {
    private requestHandler;
    private readline;
    constructor();
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    onRequest(handler: (request: any) => Promise<any>): void;
}
