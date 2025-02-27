export declare class Server {
    private info;
    private capabilities;
    private transport;
    private handlers;
    constructor(info: any, capabilities: any);
    connect(transport: any): Promise<void>;
    close(): Promise<void>;
    setRequestHandler(method: string, handler: any): void;
}
