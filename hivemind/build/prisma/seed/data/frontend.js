export const frontendFacts = [
    {
        id: 'use-tailwind',
        content: 'Always use Tailwind',
        strictness: 'RECOMMENDED',
        type: 'styling',
        category: 'FRONTEND',
        minVersion: '1.0.0',
        maxVersion: '*',
        conditions: {
            create: []
        },
        acceptanceCriteria: {
            create: []
        },
        createdAt: new Date('2025-02-23T12:00:00.893Z'),
        updatedAt: new Date('2025-02-23T12:00:00.893Z'),
        applicable: true
    },
    {
        id: 'use-shadcn',
        content: 'use ShadCN',
        strictness: 'RECOMMENDED',
        type: 'styling',
        category: 'FRONTEND',
        minVersion: '1.0.0',
        maxVersion: '*',
        conditions: {
            create: [
                {
                    type: 'REQUIRES',
                    targetId: 'use-tailwind'
                }
            ]
        },
        acceptanceCriteria: {
            create: []
        },
        createdAt: new Date('2025-02-23T12:00:33.089Z'),
        updatedAt: new Date('2025-02-23T12:00:33.089Z'),
        applicable: true
    },
    {
        id: 'use-react18',
        content: 'use React18',
        strictness: 'REQUIRED',
        type: 'framework',
        category: 'FRAMEWORK',
        minVersion: '18.0.0',
        maxVersion: '19.0.0',
        conditions: {
            create: []
        },
        acceptanceCriteria: {
            create: []
        },
        createdAt: new Date('2025-02-23T12:00:37.834Z'),
        updatedAt: new Date('2025-02-23T12:00:37.834Z'),
        applicable: true
    },
    {
        id: 'use-grid-library',
        content: 'Use AG Grid or React Table for implementing CRUD edit grids. These libraries provide robust functionality for data grid operations including sorting, filtering, editing, and state management.',
        strictness: 'RECOMMENDED',
        type: 'component',
        category: 'FRONTEND',
        minVersion: '1.0.0',
        maxVersion: '*',
        conditions: {
            create: [
                {
                    type: 'REQUIRES',
                    targetId: 'use-react18'
                }
            ]
        },
        acceptanceCriteria: {
            create: [
                {
                    description: 'Project uses either AG Grid or React Table for data grid implementations',
                    validationType: 'MANUAL'
                },
                {
                    description: 'Grid implementation supports Create, Read, Update, Delete operations',
                    validationType: 'MANUAL'
                }
            ]
        },
        createdAt: new Date('2025-02-23T17:18:44.934Z'),
        updatedAt: new Date('2025-02-23T17:18:44.934Z'),
        applicable: true
    },
    {
        id: 'use-nextjs15',
        content: 'Use Next.js 15 with App Router for all React web applications. The App Router provides enhanced features for routing, layouts, and server components.',
        strictness: 'REQUIRED',
        type: 'framework',
        category: 'FRONTEND',
        minVersion: '15.0.0',
        maxVersion: '16.0.0',
        conditions: {
            create: [
                {
                    type: 'REQUIRES',
                    targetId: 'use-react18'
                }
            ]
        },
        acceptanceCriteria: {
            create: [
                {
                    description: 'Project uses Next.js version 15.x',
                    validationType: 'MANUAL'
                },
                {
                    description: 'Project uses App Router (not Pages Router)',
                    validationType: 'MANUAL'
                },
                {
                    description: 'Project follows Next.js 15 app directory structure',
                    validationType: 'MANUAL'
                }
            ]
        },
        createdAt: new Date('2025-02-23T17:20:23.571Z'),
        updatedAt: new Date('2025-02-23T17:20:23.571Z'),
        applicable: true
    },
    {
        id: 'use-shadcn-cli',
        content: 'Use \'npx shadcn@latest\' for installing and managing shadcn components. This is the official CLI command for shadcn integration.',
        strictness: 'REQUIRED',
        type: 'tooling',
        category: 'FRONTEND',
        minVersion: '1.0.0',
        maxVersion: '*',
        conditions: {
            create: [
                {
                    type: 'REQUIRES',
                    targetId: 'use-shadcn'
                }
            ]
        },
        acceptanceCriteria: {
            create: [
                {
                    description: 'Project uses \'npx shadcn@latest\' for shadcn operations',
                    validationType: 'MANUAL'
                }
            ]
        },
        createdAt: new Date('2025-02-23T17:24:07.084Z'),
        updatedAt: new Date('2025-02-23T17:24:07.084Z'),
        applicable: true
    },
    {
        id: 'use-turbopack',
        content: 'Use Turbopack for Next.js development server (`next dev`) to benefit from faster refresh rates and improved development experience. Turbopack is a Rust-based successor to Webpack that provides significantly faster development builds.',
        strictness: 'REQUIRED',
        type: 'tooling',
        category: 'FRONTEND',
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
                    description: 'Project is configured to use Turbopack for development',
                    validationType: 'AUTOMATED'
                }
            ]
        },
        createdAt: new Date('2025-02-24T17:25:58.423Z'),
        updatedAt: new Date('2025-02-24T17:25:58.423Z'),
        applicable: true
    }
];
