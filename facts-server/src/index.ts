#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError } from '@modelcontextprotocol/sdk/types.js';
import { InMemoryStorageProvider } from './storage.js';
import { validateCriteria, validateFactConditions } from './validation.js';
import { StrictnessLevel, AcceptanceCriterion, Condition } from './types.js';

class FactsServer {
    private server: Server;
    private storage: InMemoryStorageProvider;

    constructor() {
        this.storage = new InMemoryStorageProvider();
        this.server = new Server(
            {
                name: 'facts-server',
                version: '0.1.0',
            },
            {
                capabilities: {
                    tools: {
                        get_all_facts: {
                            description: 'Get all facts in the system',
                            inputSchema: {
                                type: 'object',
                                properties: {}
                            }
                        },
                        get_fact: {
                            description: 'Get a fact by ID',
                            inputSchema: {
                                type: 'object',
                                properties: {
                                    id: {
                                        type: 'string',
                                        description: 'The ID of the fact to retrieve'
                                    }
                                },
                                required: ['id']
                            }
                        },
                        search_facts: {
                            description: 'Search facts by type, strictness, and version',
                            inputSchema: {
                                type: 'object',
                                properties: {
                                    type: {
                                        type: 'string',
                                        description: 'Filter by fact type'
                                    },
                                    strictness: {
                                        type: 'string',
                                        enum: Object.values(StrictnessLevel),
                                        description: 'Filter by strictness level'
                                    },
                                    version: {
                                        type: 'string',
                                        description: 'Filter by version compatibility'
                                    }
                                }
                            }
                        },
                        set_fact: {
                            description: 'Create or update a fact',
                            inputSchema: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    content: { type: 'string' },
                                    strictness: {
                                        type: 'string',
                                        enum: Object.values(StrictnessLevel)
                                    },
                                    type: { type: 'string' },
                                    minVersion: { type: 'string' },
                                    maxVersion: { type: 'string' },
                                    conditions: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                factId: { type: 'string' },
                                                type: {
                                                    type: 'string',
                                                    enum: ['REQUIRES', 'CONFLICTS_WITH']
                                                }
                                            },
                                            required: ['factId', 'type']
                                        }
                                    },
                                    acceptanceCriteria: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                id: { type: 'string' },
                                                description: { type: 'string' },
                                                validationType: {
                                                    type: 'string',
                                                    enum: ['MANUAL', 'AUTOMATED']
                                                },
                                                validationScript: { type: 'string' }
                                            },
                                            required: ['id', 'description', 'validationType']
                                        }
                                    }
                                },
                                required: ['id', 'content', 'strictness', 'type', 'minVersion', 'maxVersion']
                            }
                        },
                        validate_criteria: {
                            description: 'Validate content against fact acceptance criteria',
                            inputSchema: {
                                type: 'object',
                                properties: {
                                    factId: {
                                        type: 'string',
                                        description: 'ID of the fact to validate against'
                                    },
                                    content: {
                                        type: 'string',
                                        description: 'Content to validate'
                                    }
                                },
                                required: ['factId', 'content']
                            }
                        }
                    }
                }
            }
        );

        this.setupHandlers();
    }

    private setupHandlers(): void {
        // Handler for listing available tools
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                {
                    name: 'get_all_facts',
                    description: 'Get all facts in the system',
                    inputSchema: {
                        type: 'object',
                        properties: {}
                    }
                },
                {
                    name: 'get_fact',
                    description: 'Get a fact by ID',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'string',
                                description: 'The ID of the fact to retrieve'
                            }
                        },
                        required: ['id']
                    }
                },
                {
                    name: 'search_facts',
                    description: 'Search facts by type, strictness, and version',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            type: {
                                type: 'string',
                                description: 'Filter by fact type'
                            },
                            strictness: {
                                type: 'string',
                                enum: Object.values(StrictnessLevel),
                                description: 'Filter by strictness level'
                            },
                            version: {
                                type: 'string',
                                description: 'Filter by version compatibility'
                            }
                        }
                    }
                },
                {
                    name: 'set_fact',
                    description: 'Create or update a fact',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            content: { type: 'string' },
                            strictness: {
                                type: 'string',
                                enum: Object.values(StrictnessLevel)
                            },
                            type: { type: 'string' },
                            minVersion: { type: 'string' },
                            maxVersion: { type: 'string' },
                            conditions: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        factId: { type: 'string' },
                                        type: {
                                            type: 'string',
                                            enum: ['REQUIRES', 'CONFLICTS_WITH']
                                        }
                                    },
                                    required: ['factId', 'type']
                                }
                            },
                            acceptanceCriteria: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'string' },
                                        description: { type: 'string' },
                                        validationType: {
                                            type: 'string',
                                            enum: ['MANUAL', 'AUTOMATED']
                                        },
                                        validationScript: { type: 'string' }
                                    },
                                    required: ['id', 'description', 'validationType']
                                }
                            }
                        },
                        required: ['id', 'content', 'strictness', 'type', 'minVersion', 'maxVersion']
                    }
                },
                {
                    name: 'validate_criteria',
                    description: 'Validate content against fact acceptance criteria',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            factId: {
                                type: 'string',
                                description: 'ID of the fact to validate against'
                            },
                            content: {
                                type: 'string',
                                description: 'Content to validate'
                            }
                        },
                        required: ['factId', 'content']
                    }
                }
            ]
        }));

        // Handler for executing tools
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            switch (request.params.name) {
                case 'get_all_facts': {
                    const facts = await this.storage.searchFacts({});
                    return {
                        content: [{ type: 'text', text: JSON.stringify(facts, null, 2) }]
                    };
                }

                case 'get_fact': {
                    const args = request.params.arguments as { id: string };
                    const fact = await this.storage.getFact(args.id);
                    if (!fact) {
                        return {
                            content: [{ type: 'text', text: `Fact not found: ${args.id}` }],
                            isError: true
                        };
                    }
                    return {
                        content: [{ type: 'text', text: JSON.stringify(fact, null, 2) }]
                    };
                }

                case 'search_facts': {
                    const args = request.params.arguments as {
                        type?: string;
                        strictness?: StrictnessLevel;
                        version?: string;
                    };
                    const facts = await this.storage.searchFacts(args);
                    return {
                        content: [{ type: 'text', text: JSON.stringify(facts, null, 2) }]
                    };
                }

                case 'set_fact': {
                    const args = request.params.arguments as {
                        id: string;
                        content: string;
                        strictness: StrictnessLevel;
                        type: string;
                        minVersion: string;
                        maxVersion: string;
                        conditions?: Condition[];
                        acceptanceCriteria?: AcceptanceCriterion[];
                    };
                    try {
                        await this.storage.setFact(
                            args.id,
                            args.content,
                            args.strictness as StrictnessLevel,
                            args.type,
                            args.minVersion,
                            args.maxVersion,
                            args.conditions || [],
                            args.acceptanceCriteria || []
                        );
                        return {
                            content: [{ type: 'text', text: `Fact ${args.id} saved successfully` }]
                        };
                    } catch (error) {
                        return {
                            content: [{ type: 'text', text: `Error saving fact: ${error instanceof Error ? error.message : 'Unknown error'}` }],
                            isError: true
                        };
                    }
                }

                case 'validate_criteria': {
                    const args = request.params.arguments as {
                        factId: string;
                        content: string;
                    };
                    const fact = await this.storage.getFact(args.factId);
                    if (!fact) {
                        return {
                            content: [{ type: 'text', text: `Fact not found: ${args.factId}` }],
                            isError: true
                        };
                    }

                    try {
                        const results = await validateCriteria(args.content, fact.acceptanceCriteria);
                        return {
                            content: [{ type: 'text', text: JSON.stringify(results, null, 2) }]
                        };
                    } catch (error) {
                        return {
                            content: [{ type: 'text', text: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
                            isError: true
                        };
                    }
                }
            }

            throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
        });
    }

    async run(): Promise<void> {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('Facts MCP server running on stdio');
    }
}

const server = new FactsServer();
server.run().catch(console.error);
