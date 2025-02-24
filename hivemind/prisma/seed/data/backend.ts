import { Prisma } from '@prisma/client';

// Define types to match Prisma schema
type FactCreate = Prisma.FactCreateInput;

export const backendFacts: FactCreate[] = [
    {
        id: 'python_fastcgi',
        content: 'Use FastCGI for Python web applications to improve performance and resource management. FastCGI maintains persistent processes that handle multiple requests, reducing overhead compared to traditional CGI. This provides better performance, improved resource utilization, and more efficient request handling for Python web applications.',
        strictness: 'RECOMMENDED',
        type: 'backend',
        category: 'BACKEND',
        minVersion: '1.0.0',
        maxVersion: '*',
        conditions: {
            create: []
        },
        acceptanceCriteria: {
            create: [
                {
                    description: 'Project includes FastCGI configuration (e.g., in web server config or wsgi.py)',
                    validationType: 'MANUAL'
                },
                {
                    description: 'Application implements WSGI interface for FastCGI compatibility',
                    validationType: 'AUTOMATED'
                }
            ]
        },
        createdAt: new Date('2025-02-24T14:48:03.162Z'),
        updatedAt: new Date('2025-02-24T14:48:03.162Z'),
        applicable: true
    },
    {
        id: 'python_pydantic',
        content: 'Use Pydantic for data validation, serialization, and settings management in Python applications. Pydantic leverages Python type annotations to provide runtime validation, serialization, and documentation. This ensures type safety, improves code reliability, and simplifies data handling across the application.',
        strictness: 'REQUIRED',
        type: 'backend',
        category: 'BACKEND',
        minVersion: '1.0.0',
        maxVersion: '*',
        conditions: {
            create: []
        },
        acceptanceCriteria: {
            create: [
                {
                    description: 'Data models are defined using Pydantic BaseModel',
                    validationType: 'AUTOMATED'
                },
                {
                    description: 'Models use proper type annotations for all fields',
                    validationType: 'AUTOMATED'
                },
                {
                    description: 'Application settings are managed using Pydantic BaseSettings',
                    validationType: 'AUTOMATED'
                }
            ]
        },
        createdAt: new Date('2025-02-24T14:48:14.982Z'),
        updatedAt: new Date('2025-02-24T14:48:14.982Z'),
        applicable: true
    },
    {
        id: 'python-web-mvc',
        content: 'Python web applications should follow the MVC (Model-View-Controller) pattern:\n- Models: Handle data logic and database interactions\n- Views: Handle presentation logic using templates\n- Controllers: Handle request/response flow and business logic\n\nImplementation requirements:\n1. Separate concerns between models, views, and controllers\n2. Use an ORM or data access layer for database operations\n3. Template engine for view rendering\n4. RESTful routing conventions',
        strictness: 'RECOMMENDED',
        type: 'ARCHITECTURE_PATTERN',
        category: 'BACKEND',
        minVersion: '1.0.0',
        maxVersion: '*',
        conditions: {
            create: []
        },
        acceptanceCriteria: {
            create: []
        },
        createdAt: new Date('2025-02-24T15:08:15.911Z'),
        updatedAt: new Date('2025-02-24T15:08:15.911Z'),
        applicable: true
    },
    {
        id: 'python-project-structure',
        content: 'Python web projects should follow a clear directory structure:\n\n1. Application root:\n   - Main application file\n   - Configuration files\n   - Requirements file\n\n2. Core directories:\n   - models/: Data models and database interactions\n   - templates/: View templates\n   - static/: Static assets (CSS, JS, images)\n   - routes/: Route handlers and controllers\n\n3. Supporting directories:\n   - database/: Database migrations and schemas\n   - services/: Business logic and external services\n   - utils/: Helper functions and utilities\n\nEach directory should have a clear single responsibility and maintain separation of concerns.',
        strictness: 'RECOMMENDED',
        type: 'PROJECT_STRUCTURE',
        category: 'BACKEND',
        minVersion: '1.0.0',
        maxVersion: '*',
        conditions: {
            create: []
        },
        acceptanceCriteria: {
            create: []
        },
        createdAt: new Date('2025-02-24T15:08:31.682Z'),
        updatedAt: new Date('2025-02-24T15:08:31.682Z'),
        applicable: true
    }
];
