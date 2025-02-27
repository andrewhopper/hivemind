// MCP Error codes
export var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["ParseError"] = -32700] = "ParseError";
    ErrorCode[ErrorCode["InvalidRequest"] = -32600] = "InvalidRequest";
    ErrorCode[ErrorCode["MethodNotFound"] = -32601] = "MethodNotFound";
    ErrorCode[ErrorCode["InvalidParams"] = -32602] = "InvalidParams";
    ErrorCode[ErrorCode["InternalError"] = -32603] = "InternalError";
})(ErrorCode || (ErrorCode = {}));
// MCP Error class
export class McpError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
        this.name = 'McpError';
    }
}
// Schema constants
export const ListToolsRequestSchema = 'list_tools';
export const CallToolRequestSchema = 'call_tool';
