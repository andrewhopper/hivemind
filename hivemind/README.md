# Hivemind MCP Server

An MCP server for managing development knowledge and validation through facts and acceptance criteria. This server provides tools for storing, retrieving, and validating architectural decisions, coding standards, and best practices.

## Features

- Store and manage development facts with strictness levels
- Track dependencies between facts
- Define acceptance criteria for validation
- Categorize facts by type (frontend, backend, database, etc.)
- Prisma-based SQLite storage
- Full TypeScript support

## Installation

```bash
npm install @modelcontextprotocol/hivemind
```

## Configuration

1. Environment Variables:
   - No environment variables required by default
   - SQLite database is created automatically in `prisma/facts.db`

2. Database Setup:
   ```bash
   # Generate Prisma Client
   npm run prisma:generate
   
   # Run migrations
   npx prisma migrate deploy
   
   # Seed the database with default facts
   npm run db:seed
   ```

## Usage

### As an MCP Server

```typescript
import { Server } from '@modelcontextprotocol/hivemind';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio';

const server = new Server({
  name: 'hivemind',
  version: '1.0.0'
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

### Available Tools

1. `get_all_facts`: Get all facts in the system
2. `get_fact`: Get a fact by ID
3. `search_facts`: Search facts by type, strictness, and version
4. `set_fact`: Create or update a fact
5. `validate_criteria`: Validate content against fact acceptance criteria

## Development

### Project Structure

```
hivemind/
├── prisma/
│   ├── schema.prisma    # Database schema
│   ├── migrations/      # Database migrations
│   └── seed/           # Seed data
│       ├── index.ts    # Main seed file
│       └── data/       # Categorized seed data
│           ├── frontend.ts
│           ├── backend.ts
│           ├── database.ts
│           ├── architecture.ts
│           ├── documentation.ts
│           └── tooling.ts
├── src/
│   ├── index.ts        # Main server file
│   ├── storage.ts      # Database operations
│   ├── types.ts        # Type definitions
│   └── validation.ts   # Validation logic
└── package.json
```

### Scripts

- `npm run build` - Build the TypeScript code
- `npm run dev` - Run the server in development mode
- `npm run start` - Run the built server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:seed` - Run database seeding
- `npm run db:seed` - Alias for prisma db seed

### Seeding

The server comes with pre-defined facts covering various aspects of development:

- Frontend practices (React, Next.js, styling)
- Backend patterns (Python, FastCGI, MVC)
- Database requirements (PostgreSQL, ORMs)
- Architecture decisions
- Documentation standards
- Development tooling

To modify or add new facts:

1. Edit or create new files in `prisma/seed/data/`
2. Run `npm run db:seed` to apply changes

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
