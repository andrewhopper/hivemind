#!/usr/bin/env node
import { Server } from './sdk/server.js';
import { StdioServerTransport } from './sdk/stdio.js';
import { InMemoryStorageProvider } from './storage.js';
import { validateCriteria } from './validation.js';
import { StrictnessLevel } from './types.js';
class FactsServer {
    constructor() {
        this.storage = new InMemoryStorageProvider();
        this.server = new Server({
            name: 'facts-server',
            version: '0.1.0',
        }, {
            capabilities: {
                tools: {
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
        });
        this.setupHandlers();
    }
    setupHandlers() {
        this.server.setHandler('get_fact', async (request) => {
            const params = request.params;
            const fact = await this.storage.getFact(params.id);
            if (!fact) {
                return {
                    content: [{ type: 'text', text: `Fact not found: ${params.id}` }],
                    isError: true
                };
            }
            return {
                content: [{ type: 'text', text: JSON.stringify(fact, null, 2) }]
            };
        });
        this.server.setHandler('search_facts', async (request) => {
            const params = request.params;
            const facts = await this.storage.searchFacts(params);
            return {
                content: [{ type: 'text', text: JSON.stringify(facts, null, 2) }]
            };
        });
        this.server.setHandler('set_fact', async (request) => {
            const params = request.params;
            try {
                await this.storage.setFact(params.id, params.content, params.strictness, params.type, params.minVersion, params.maxVersion, params.conditions, params.acceptanceCriteria);
                return {
                    content: [{ type: 'text', text: `Fact ${params.id} saved successfully` }]
                };
            }
            catch (error) {
                return {
                    content: [{ type: 'text', text: `Error saving fact: ${error instanceof Error ? error.message : 'Unknown error'}` }],
                    isError: true
                };
            }
        });
        this.server.setHandler('validate_criteria', async (request) => {
            const params = request.params;
            const fact = await this.storage.getFact(params.factId);
            if (!fact) {
                return {
                    content: [{ type: 'text', text: `Fact not found: ${params.factId}` }],
                    isError: true
                };
            }
            try {
                const results = await validateCriteria(params.content, fact.acceptanceCriteria);
                return {
                    content: [{ type: 'text', text: JSON.stringify(results, null, 2) }]
                };
            }
            catch (error) {
                return {
                    content: [{ type: 'text', text: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
                    isError: true
                };
            }
        });
    }
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('Facts MCP server running on stdio');
    }
}
const server = new FactsServer();
server.run().catch(console.error);
