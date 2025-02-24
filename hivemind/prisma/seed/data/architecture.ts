import { Prisma } from '@prisma/client';

// Define types to match Prisma schema
type FactCreate = Prisma.FactCreateInput;

export const architectureFacts: FactCreate[] = [
    {
        id: 'arch_nextjs_frontend',
        content: 'Next.js should be used as the frontend framework for web applications. This provides built-in SSR/SSG capabilities, file-based routing, and modern React features for optimal performance and developer experience.',
        strictness: 'REQUIRED',
        type: 'architecture_decision',
        category: 'ARCHITECTURE_PATTERN',
        minVersion: '1.0.0',
        maxVersion: '*',
        conditions: {
            create: []
        },
        acceptanceCriteria: {
            create: [
                {
                    description: 'Project contains next.config.ts/js file with appropriate configuration',
                    validationType: 'AUTOMATED'
                },
                {
                    description: 'Uses Next.js file-based routing structure in app/ directory',
                    validationType: 'AUTOMATED'
                },
                {
                    description: 'React components follow Next.js best practices for server/client components',
                    validationType: 'MANUAL'
                }
            ]
        },
        createdAt: new Date('2025-02-24T14:51:46.365Z'),
        updatedAt: new Date('2025-02-24T14:51:46.365Z'),
        applicable: true
    },
    {
        id: 'validation_stages_workflow',
        content: 'Projects must follow a three-stage validation workflow: pre-planning, post-planning, and post-implementation. Each stage requires specific fact validations and generates appropriate reports. Pre-planning validates architecture and tool requirements, post-planning ensures plan compliance with patterns, and post-implementation verifies the final implementation against all applicable facts.',
        strictness: 'REQUIRED',
        type: 'architecture_decision',
        category: 'ARCHITECTURE_PATTERN',
        minVersion: '1.0.0',
        maxVersion: '*',
        conditions: {
            create: []
        },
        acceptanceCriteria: {
            create: [
                {
                    description: 'Pre-planning validation checks architecture patterns and tool requirements',
                    validationType: 'AUTOMATED'
                },
                {
                    description: 'Post-planning validation verifies compliance with required patterns',
                    validationType: 'AUTOMATED'
                },
                {
                    description: 'Post-implementation validation verifies all implementation details against facts',
                    validationType: 'AUTOMATED'
                },
                {
                    description: 'Each validation stage generates appropriate reports in docs/validation/',
                    validationType: 'AUTOMATED'
                }
            ]
        },
        createdAt: new Date('2025-02-24T15:06:27.714Z'),
        updatedAt: new Date('2025-02-24T15:06:27.714Z'),
        applicable: true
    },
    {
        id: 'development-scope',
        content: 'Determine the development scope/rigor level for each project:\n\n1. Quick Prototype/Personal:\n- Minimal security requirements\n- Basic error handling\n- Local development focus\n- Simple deployment\n- Limited scalability concerns\n\n2. Semi-Public:\n- Basic security measures\n- Proper error handling\n- Some monitoring\n- Moderate scalability\n- Basic CI/CD\n\n3. Full Production:\n- Comprehensive security (auth, encryption, rate limiting)\n- Extensive error handling and logging\n- Full monitoring and alerting\n- High scalability and availability\n- Robust CI/CD pipeline\n- Backup and recovery procedures\n- Performance optimization\n- Security audits and penetration testing',
        strictness: 'REQUIRED',
        type: 'architecture_decision',
        category: 'ARCHITECTURE_PATTERN',
        minVersion: '1.0.0',
        maxVersion: '*',
        conditions: {
            create: []
        },
        acceptanceCriteria: {
            create: [
                {
                    description: 'Project scope level is explicitly defined in documentation',
                    validationType: 'MANUAL'
                },
                {
                    description: 'Implementation matches the defined scope level requirements',
                    validationType: 'MANUAL'
                }
            ]
        },
        createdAt: new Date('2025-02-24T17:22:17.884Z'),
        updatedAt: new Date('2025-02-24T17:22:17.884Z'),
        applicable: true
    },
    {
        id: 'next_15_app_router_patterns',
        content: 'Follow Next.js 15 App Router best practices: 1) Use Server Components by default for improved performance and reduced client-side JavaScript, 2) Implement route groups with (folder) for logical organization without affecting URL structure, 3) Leverage parallel routes and intercepting routes for advanced UI patterns.',
        strictness: 'RECOMMENDED',
        type: 'framework_patterns',
        category: 'ARCHITECTURE_PATTERN',
        minVersion: '15.0.0',
        maxVersion: '*',
        conditions: {
            create: [
                {
                    type: 'REQUIRES',
                    targetId: 'use-nextjs15'
                }
            ]
        },
        acceptanceCriteria: {
            create: [
                {
                    description: 'Components are Server Components by default unless explicitly marked with \'use client\'',
                    validationType: 'MANUAL'
                },
                {
                    description: 'Route groups are used to organize related routes without affecting the URL structure',
                    validationType: 'MANUAL'
                },
                {
                    description: 'Parallel and intercepting routes are used where appropriate for complex UI patterns',
                    validationType: 'MANUAL'
                }
            ]
        },
        createdAt: new Date('2025-02-24T13:55:09.683Z'),
        updatedAt: new Date('2025-02-24T13:55:09.683Z'),
        applicable: true
    },
    {
        id: 'nextjs-src-directory',
        content: 'Use a src/ directory structure in Next.js projects to better organize application code. This provides clearer separation of application code from configuration files and other project assets. The src/ directory should contain:\n\n1. app/ - Next.js app router pages and layouts\n2. components/ - React components\n3. lib/ - Utility functions and shared code\n4. styles/ - CSS and styling files\n5. types/ - TypeScript type definitions\n\nConfiguration files (next.config.js, tailwind.config.js, etc.) should remain in the root directory.',
        strictness: 'REQUIRED',
        type: 'project_structure',
        category: 'PROJECT_STRUCTURE',
        minVersion: '1.0.0',
        maxVersion: '*',
        conditions: {
            create: [
                {
                    type: 'REQUIRES',
                    targetId: 'use-nextjs15'
                }
            ]
        },
        acceptanceCriteria: {
            create: [
                {
                    description: 'Project contains a src/ directory with proper structure',
                    validationType: 'AUTOMATED'
                },
                {
                    description: 'Code is properly organized within src/ directory',
                    validationType: 'MANUAL'
                }
            ]
        },
        createdAt: new Date('2025-02-24T17:26:04.599Z'),
        updatedAt: new Date('2025-02-24T17:26:04.599Z'),
        applicable: true
    }
];
