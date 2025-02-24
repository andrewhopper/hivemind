export const documentationFacts = [
    {
        id: 'maintain-readme',
        content: 'Each project must maintain an up-to-date README.md file in the root directory using markdown format. The README should include: project overview, features, setup instructions, usage guidelines, and any other relevant documentation for developers.',
        strictness: 'REQUIRED',
        type: 'documentation',
        category: 'DOCUMENTATION',
        minVersion: '1.0.0',
        maxVersion: '*',
        conditions: {
            create: []
        },
        acceptanceCriteria: {
            create: [
                {
                    description: 'A README.md file exists in the root directory',
                    validationType: 'MANUAL'
                },
                {
                    description: 'README includes required sections: overview, features, setup, usage',
                    validationType: 'MANUAL'
                },
                {
                    description: 'README uses proper markdown formatting',
                    validationType: 'MANUAL'
                }
            ]
        },
        createdAt: new Date('2025-02-23T17:16:46.729Z'),
        updatedAt: new Date('2025-02-23T17:16:46.729Z'),
        applicable: true
    },
    {
        id: 'document-dev-scope',
        content: 'The project\'s development scope (Quick Prototype/Personal, Semi-Public, or Full Production) must be clearly documented in the README.md file. This documentation should include:\n\n1. Explicit statement of the scope level\n2. List of implemented security measures\n3. Scalability considerations\n4. Monitoring approach\n5. Deployment requirements\n\nThis helps developers understand the project\'s constraints and requirements at a glance.',
        strictness: 'REQUIRED',
        type: 'documentation',
        category: 'DOCUMENTATION',
        minVersion: '1.0.0',
        maxVersion: '*',
        conditions: {
            create: [
                {
                    type: 'REQUIRES',
                    targetId: 'maintain-readme'
                },
                {
                    type: 'REQUIRES',
                    targetId: 'development-scope'
                }
            ]
        },
        acceptanceCriteria: {
            create: [
                {
                    description: 'README.md includes explicit development scope level',
                    validationType: 'MANUAL'
                },
                {
                    description: 'Security, scalability, and operational measures are documented',
                    validationType: 'MANUAL'
                }
            ]
        },
        createdAt: new Date('2025-02-24T17:22:57.835Z'),
        updatedAt: new Date('2025-02-24T17:22:57.835Z'),
        applicable: true
    }
];
