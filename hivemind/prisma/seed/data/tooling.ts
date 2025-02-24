import { Prisma } from '@prisma/client';

// Define types to match Prisma schema
type FactCreate = Prisma.FactCreateInput;

export const toolingFacts: FactCreate[] = [
    {
        id: 'python_uv_package_manager',
        content: 'Use uv as the package manager for all Python projects. uv is a fast, reliable and feature-rich alternative to pip that provides better dependency resolution, caching, and performance.',
        strictness: 'REQUIRED',
        type: 'package_management',
        category: 'PACKAGE_MANAGEMENT',
        minVersion: '1.0.0',
        maxVersion: '*',
        conditions: {
            create: []
        },
        acceptanceCriteria: {
            create: []
        },
        createdAt: new Date('2025-02-24T14:46:16.633Z'),
        updatedAt: new Date('2025-02-24T14:46:16.633Z'),
        applicable: true
    },
    {
        id: 'python_virtual_environments',
        content: 'Always use virtual environments for Python projects. Virtual environments isolate project dependencies, prevent conflicts between different projects, and ensure reproducible development environments. Create a new virtual environment for each project and activate it before installing dependencies or running the project.',
        strictness: 'REQUIRED',
        type: 'package_management',
        category: 'PACKAGE_MANAGEMENT',
        minVersion: '1.0.0',
        maxVersion: '*',
        conditions: {
            create: []
        },
        acceptanceCriteria: {
            create: [
                {
                    description: 'Project contains a virtual environment directory (venv/ or .venv/)',
                    validationType: 'AUTOMATED'
                },
                {
                    description: 'Project contains requirements.txt or pyproject.toml for dependency management',
                    validationType: 'AUTOMATED'
                }
            ]
        },
        createdAt: new Date('2025-02-24T14:47:57.400Z'),
        updatedAt: new Date('2025-02-24T14:47:57.400Z'),
        applicable: true
    }
];
