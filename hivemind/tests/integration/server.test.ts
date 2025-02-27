import { Server } from '../../build/sdk/server.js';
import { StdioServerTransport } from '../../build/sdk/stdio.js';
import { testUtils } from '../setup.js';
import { StrictnessLevel, FactCategory } from '../../src/types.js';
import type { Prisma } from '@prisma/client';

interface McpRequest {
    jsonrpc: '2.0';
    id: string;
    method: string;
    params: Record<string, unknown>;
}

interface McpResponse {
    content: Array<{ type: 'text'; text: string }>;
    isError?: boolean;
}

describe('MCP Server Integration', () => {
    let server: Server;
    let transport: StdioServerTransport;
    let requestHandler: (request: McpRequest) => Promise<McpResponse>;

    beforeEach(async () => {
        server = new Server(
            {
                name: 'hivemind-test',
                version: '1.0.0'
            },
            {
                capabilities: {
                    tools: {
                        get_all_facts: {
                            description: 'Get all facts',
                            inputSchema: {
                                type: 'object',
                                properties: {}
                            }
                        },
                        get_fact: {
                            description: 'Get a specific fact',
                            inputSchema: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' }
                                },
                                required: ['id']
                            }
                        },
                        search_facts: {
                            description: 'Search facts',
                            inputSchema: {
                                type: 'object',
                                properties: {
                                    type: { type: 'string' },
                                    strictness: { type: 'string' }
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
                                    strictness: { type: 'string' },
                                    type: { type: 'string' },
                                    category: { type: 'string' }
                                },
                                required: ['id', 'content', 'strictness', 'type', 'category']
                            }
                        }
                    }
                }
            }
        );

        transport = new StdioServerTransport();
        await server.connect(transport);

        // Capture the request handler
        transport.onRequest(async (request) => {
            requestHandler = request;
            return { content: [{ type: 'text', text: 'Handler captured' }] };
        });

        // Register handlers
        server.setRequestHandler('get_all_facts', async () => {
            const facts = await testUtils.prisma.fact.findMany();
            return {
                content: [{ type: 'text', text: JSON.stringify(facts) }]
            };
        });

        server.setRequestHandler('get_fact', async (request: McpRequest) => {
            const id = request.params.id as string;
            const fact = await testUtils.prisma.fact.findUnique({
                where: { id }
            });
            return {
                content: [{ type: 'text', text: JSON.stringify(fact) }]
            };
        });

        server.setRequestHandler('search_facts', async (request: McpRequest) => {
            const { type, strictness } = request.params as { type?: string; strictness?: string };
            const facts = await testUtils.prisma.fact.findMany({
                where: {
                    OR: [
                        type ? { type } : {},
                        strictness ? { strictness } : {}
                    ]
                }
            });
            return {
                content: [{ type: 'text', text: JSON.stringify(facts) }]
            };
        });

        server.setRequestHandler('set_fact', async (request: McpRequest) => {
            const params = request.params as Prisma.FactCreateInput;
            const fact = await testUtils.prisma.fact.upsert({
                where: { id: params.id },
                update: params,
                create: params
            });
            return {
                content: [{ type: 'text', text: JSON.stringify(fact) }]
            };
        });
    });

    afterEach(async () => {
        await server.close();
        await testUtils.clearDatabase();
    });

    const makeRequest = async (method: string, params: Record<string, unknown>) => {
        const response = await requestHandler({
            jsonrpc: '2.0',
            id: '1',
            method,
            params
        });
        return JSON.parse(response.content[0].text);
    };

    describe('get_all_facts', () => {
        it('should return all facts', async () => {
            // Create test facts
            await testUtils.createTestFact({
                id: 'test-fact-1',
                content: 'Test fact 1',
                strictness: StrictnessLevel.REQUIRED,
                category: FactCategory.TESTING_PATTERN
            });

            await testUtils.createTestFact({
                id: 'test-fact-2',
                content: 'Test fact 2',
                strictness: StrictnessLevel.RECOMMENDED,
                category: FactCategory.TESTING_PATTERN
            });

            const facts = await makeRequest('get_all_facts', {});
            expect(facts).toHaveLength(2);
            expect(facts[0].id).toBe('test-fact-1');
            expect(facts[1].id).toBe('test-fact-2');
        });
    });

    describe('get_fact', () => {
        it('should return a specific fact', async () => {
            const testFact = await testUtils.createTestFact({
                id: 'test-fact',
                content: 'Test fact content',
                strictness: StrictnessLevel.REQUIRED,
                category: FactCategory.TESTING_PATTERN
            });

            const fact = await makeRequest('get_fact', { id: testFact.id });
            expect(fact).toBeDefined();
            expect(fact.id).toBe(testFact.id);
            expect(fact.content).toBe(testFact.content);
        });

        it('should return null for non-existent fact', async () => {
            const fact = await makeRequest('get_fact', { id: 'non-existent' });
            expect(fact).toBeNull();
        });
    });

    describe('search_facts', () => {
        beforeEach(async () => {
            // Create test facts
            await testUtils.createTestFact({
                id: 'frontend-fact',
                content: 'Frontend fact',
                strictness: StrictnessLevel.REQUIRED,
                category: FactCategory.FRONTEND,
                type: 'styling'
            });

            await testUtils.createTestFact({
                id: 'backend-fact',
                content: 'Backend fact',
                strictness: StrictnessLevel.RECOMMENDED,
                category: FactCategory.BACKEND,
                type: 'pattern'
            });
        });

        it('should search facts by type', async () => {
            const facts = await makeRequest('search_facts', { type: 'styling' });
            expect(facts).toHaveLength(1);
            expect(facts[0].id).toBe('frontend-fact');
        });

        it('should search facts by strictness', async () => {
            const facts = await makeRequest('search_facts', {
                strictness: StrictnessLevel.RECOMMENDED
            });
            expect(facts).toHaveLength(1);
            expect(facts[0].id).toBe('backend-fact');
        });
    });

    describe('set_fact', () => {
        it('should create a new fact', async () => {
            const fact = await makeRequest('set_fact', {
                id: 'new-fact',
                content: 'New fact content',
                strictness: StrictnessLevel.REQUIRED,
                type: 'test',
                category: FactCategory.TESTING_PATTERN,
                minVersion: '1.0.0',
                maxVersion: '*'
            });

            expect(fact).toBeDefined();
            expect(fact.id).toBe('new-fact');
            expect(fact.content).toBe('New fact content');
        });

        it('should update an existing fact', async () => {
            // Create initial fact
            await testUtils.createTestFact({
                id: 'update-fact',
                content: 'Original content'
            });

            const fact = await makeRequest('set_fact', {
                id: 'update-fact',
                content: 'Updated content',
                strictness: StrictnessLevel.REQUIRED,
                type: 'test',
                category: FactCategory.TESTING_PATTERN,
                minVersion: '1.0.0',
                maxVersion: '*'
            });

            expect(fact).toBeDefined();
            expect(fact.id).toBe('update-fact');
            expect(fact.content).toBe('Updated content');
        });
    });
});
