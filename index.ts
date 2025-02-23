import express, { Request, Response } from 'express';
import { promises as fs } from 'fs';

// Enhanced type definitions to include acceptance criteria
interface Condition {
    factId: string;
    type: 'REQUIRES' | 'CONFLICTS_WITH';
}

interface AcceptanceCriterion {
    id: string;
    description: string;
    validationType: 'MANUAL' | 'AUTOMATED';
    validationScript?: string; // For automated validation
}

interface FactData {
    content: string;
    strictness: StrictnessLevel;
    type: string;
    minVersion: string;
    maxVersion: string;
    conditions: Condition[];
    acceptanceCriteria: AcceptanceCriterion[];
    createdAt: string;
    updatedAt: string;
}

interface StorageSearchResult extends FactData {
    id: string;
    applicable: boolean;
}

// Update request types
interface SetFactRequest extends Request {
    body: {
        fact: string;
        strictness?: StrictnessLevel;
        type: string;
        minVersion: string;
        maxVersion: string;
        conditions: Condition[];
        acceptanceCriteria: AcceptanceCriterion[];
    }
}

// ... (previous code for StorageProvider and implementations remains the same) ...

// Example usage with acceptance criteria
async function setupExampleFacts(server: MCPFactsServer) {
    const facts = [
        {
            id: "documentation-diagrams",
            fact: "Always create both entity relationship and sequence diagrams when implementing new features.",
            type: "documentation",
            strictness: StrictnessLevel.REQUIRED,
            minVersion: "1.0.0",
            maxVersion: "2.0.0",
            conditions: [],
            acceptanceCriteria: [
                {
                    id: "seq-diagram-exists",
                    description: "Mermaid sequence diagram exists in documentation",
                    validationType: "MANUAL"
                },
                {
                    id: "entity-diagram-exists",
                    description: "Mermaid entity diagram exists in documentation",
                    validationType: "MANUAL"
                },
                {
                    id: "unique-node-ids",
                    description: "Each node in diagrams has a unique identifier",
                    validationType: "AUTOMATED",
                    validationScript: `
                        function validateNodeIds(diagramContent) {
                            const nodeMatches = diagramContent.match(/participant \w+|actor \w+/g);
                            if (!nodeMatches) return true;
                            
                            const nodes = nodeMatches.map(match => match.split(' ')[1]);
                            const uniqueNodes = new Set(nodes);
                            return nodes.length === uniqueNodes.size;
                        }
                    `
                },
                {
                    id: "diagram-title",
                    description: "Diagram includes a title section",
                    validationType: "AUTOMATED",
                    validationScript: `
                        function validateTitle(diagramContent) {
                            return diagramContent.includes('title:') || 
                                   diagramContent.includes('---\ntitle:');
                        }
                    `
                }
            ]
        },
        {
            id: "api-documentation",
            fact: "Document all API endpoints using OpenAPI/Swagger specification.",
            type: "documentation",
            strictness: StrictnessLevel.REQUIRED,
            minVersion: "1.0.0",
            maxVersion: "2.0.0",
            conditions: [],
            acceptanceCriteria: [
                {
                    id: "swagger-file-exists",
                    description: "OpenAPI/Swagger specification file exists",
                    validationType: "MANUAL"
                },
                {
                    id: "endpoint-examples",
                    description: "Each endpoint includes request/response examples",
                    validationType: "AUTOMATED",
                    validationScript: `
                        function validateEndpointExamples(swaggerContent) {
                            const swagger = JSON.parse(swaggerContent);
                            return Object.values(swagger.paths).every(path => 
                                Object.values(path).every(method =>
                                    method.requestBody?.content?.['application/json']?.example &&
                                    method.responses?.['200']?.content?.['application/json']?.example
                                )
                            );
                        }
                    `
                }
            ]
        },
        {
            id: "component-documentation",
            fact: "Document React components with TSDoc comments.",
            type: "documentation",
            strictness: StrictnessLevel.REQUIRED,
            minVersion: "1.0.0",
            maxVersion: "2.0.0",
            conditions: [
                {
                    factId: "typescript",
                    type: "REQUIRES"
                }
            ],
            acceptanceCriteria: [
                {
                    id: "tsdoc-exists",
                    description: "TSDoc comment block exists above component definition",
                    validationType: "AUTOMATED",
                    validationScript: `
                        function validateTSDoc(fileContent) {
                            return /\/\*\*[\s\S]*?\*\/\s*(export\s+)?((default\s+)?function|class|const)\s+\w+/.test(fileContent);
                        }
                    `
                },
                {
                    id: "props-documented",
                    description: "All props are documented with types and descriptions",
                    validationType: "AUTOMATED",
                    validationScript: `
                        function validatePropsDoc(fileContent) {
                            const propsInterface = fileContent.match(/interface\s+\w+Props\s*{[\s\S]*?}/);
                            if (!propsInterface) return false;
                            
                            const props = propsInterface[0].match(/\/\*\*[\s\S]*?\*\/\s*\w+:/g);
                            return props && props.length > 0;
                        }
                    `
                }
            ]
        }
    ];

    for (const fact of facts) {
        await server.storage.setFact(
            fact.id,
            fact.fact,
            fact.strictness,
            fact.type,
            fact.minVersion,
            fact.maxVersion,
            fact.conditions,
            fact.acceptanceCriteria
        );
    }
}

/*
Example API usage:

# Get documentation requirements with acceptance criteria
curl "http://localhost:3000/search_facts?type=documentation"

Response will include acceptance criteria:
{
  "results": [
    {
      "id": "documentation-diagrams",
      "content": "Always create both entity relationship and sequence diagrams...",
      "acceptanceCriteria": [
        {
          "id": "seq-diagram-exists",
          "description": "Mermaid sequence diagram exists in documentation",
          "validationType": "MANUAL"
        },
        {
          "id": "unique-node-ids",
          "description": "Each node in diagrams has a unique identifier",
          "validationType": "AUTOMATED",
          "validationScript": "..."
        }
      ],
      ...
    }
  ]
}

# Validate specific criteria
curl -X POST http://localhost:3000/validate-criteria \
  -H "Content-Type: application/json" \
  -d '{
    "factId": "documentation-diagrams",
    "content": "sequenceDiagram\n  participant A\n  participant B\n  A->>B: Message"
  }'
*/