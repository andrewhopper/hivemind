import { Prisma } from '@prisma/client';

// Define types to match Prisma schema
type FactCreate = Prisma.FactCreateInput;

export const databaseFacts: FactCreate[] = [
    {
        id: 'use-postgres',
        content: 'Use PostgreSQL for all databases',
        strictness: 'REQUIRED',
        type: 'database',
        category: 'DATABASE',
        minVersion: '14.0.0',
        maxVersion: '15.0.0',
        conditions: {
            create: []
        },
        acceptanceCriteria: {
            create: []
        },
        createdAt: new Date('2025-02-23T17:12:36.195Z'),
        updatedAt: new Date('2025-02-23T17:12:36.195Z'),
        applicable: true
    },
    {
        id: 'python_sqlalchemy',
        content: 'Use SQLAlchemy as the standard ORM for all Python database interactions. SQLAlchemy provides a comprehensive set of tools for database operations, including both Core and ORM layers, robust transaction management, connection pooling, and migration support. This ensures consistent, secure, and maintainable database access across Python applications.',
        strictness: 'REQUIRED',
        type: 'database',
        category: 'DATABASE',
        minVersion: '1.0.0',
        maxVersion: '*',
        conditions: {
            create: []
        },
        acceptanceCriteria: {
            create: [
                {
                    description: 'Database models are defined using SQLAlchemy ORM classes',
                    validationType: 'AUTOMATED'
                },
                {
                    description: 'Proper session management practices are implemented (creation, commit, rollback, cleanup)',
                    validationType: 'AUTOMATED'
                },
                {
                    description: 'Database migrations are managed using Alembic',
                    validationType: 'AUTOMATED'
                }
            ]
        },
        createdAt: new Date('2025-02-24T14:48:09.541Z'),
        updatedAt: new Date('2025-02-24T14:48:09.541Z'),
        applicable: true
    },
    {
        id: 'arch_prisma_orm',
        content: 'Prisma should be used as the ORM for database access. This ensures type-safe database operations, schema management, and migration handling. Prisma provides a clean API for database operations while maintaining type safety and reducing runtime errors.',
        strictness: 'REQUIRED',
        type: 'architecture_decision',
        category: 'DATABASE',
        minVersion: '1.0.0',
        maxVersion: '*',
        conditions: {
            create: [
                {
                    type: 'REQUIRES',
                    targetId: 'arch_sqlite_db'
                }
            ]
        },
        acceptanceCriteria: {
            create: [
                {
                    description: 'Project contains prisma/schema.prisma with defined models',
                    validationType: 'AUTOMATED'
                },
                {
                    description: 'Uses Prisma Client for database operations with proper error handling',
                    validationType: 'MANUAL'
                },
                {
                    description: 'Database changes are managed through Prisma migrations',
                    validationType: 'AUTOMATED'
                }
            ]
        },
        createdAt: new Date('2025-02-24T14:51:52.205Z'),
        updatedAt: new Date('2025-02-24T14:51:52.205Z'),
        applicable: true
    }
];
