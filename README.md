# HiveMind

A fact management system that provides automatic coding tools with consistent guidance about libraries, patterns, and development standards.

## Why HiveMind?

AI coding tools make the same mistakes again and again.  If you've tried building with NextJS 15 they frequently mess up AppRouter; using ShadCN chances are they've used the wrong command- npx install shadcn-ui instead of npx install shadcn.  They also don't make good or consistent architecture and design decisions.

![Side by side comparison showing HiveMind's impact](docs/side-by-side.png)

When working with automatic coding tools like Cline in Cursor, developers often find themselves repeatedly providing the same guidance about coding standards, preferred libraries, and architectural patterns. HiveMind solves this by creating a centralized system for managing and enforcing these development guidelines through the Model Context Protocol (MCP).

This repository is a prototype that demonstrates an MCP server that allows facts to be set, retrieved, searched, and validated against. The goal is to help autonomous coding tools maintain consistency with your project's standards and preferences.

See an [example validation report](docs/validation/2025-02-24-validation-report.md) that demonstrates how HiveMind validates projects against established facts.

## Hivemind in Action

<div>
    <a href="https://www.loom.com/share/628bf9b86a8f4586a8bdbbf062c110a3">
      <p>Collaborating with Claude on Dev Standards</p>
    </a>
    <a href="https://www.loom.com/share/628bf9b86a8f4586a8bdbbf062c110a3">
      <img style="max-width:300px;" src="https://cdn.loom.com/sessions/thumbnails/628bf9b86a8f4586a8bdbbf062c110a3-df2564e9c944b81b-full-play.gif">
    </a>
  </div>

<div>
    <a href="https://www.loom.com/share/c95b6c4965ea4d519c3d567ac13a9e03">
      <p>Using dev standards for a new project</p>
    </a>
    <a href="https://www.loom.com/share/c95b6c4965ea4d519c3d567ac13a9e03">
      <img style="max-width:300px;" src="https://cdn.loom.com/sessions/thumbnails/c95b6c4965ea4d519c3d567ac13a9e03-847027c8986a0186-full-play.gif">
    </a>
  </div>


## Features
- **Facts Management**: Store and retrieve development decisions, guidelines, and standards
- **Automated Validation**: Validate code changes against established criteria
- **Flexible Categories**: Support for multiple development aspects (frontend, backend, security, etc.)
- **Configurable Rules**: Adjustable strictness levels for different types of guidelines

## Getting Started

### Prerequisites
- Node.js
- SQLite
- MCP SDK

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   cd facts-server
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```
4. Configure the MCP service:

   ```
    "hivemind": {
      "command": "node",
      "args": [
        "<YOUR PATH>/hivemind/facts-server/build/index.js"
      ],
      "env": {},
      "disabled": false,
      "autoApprove": []
    }
   ```

### Configuration

The `.clinerules` file configures how facts are managed:

- Automatic saving of development decisions
- Validation of proposals against existing facts
- Strictness levels for different fact types
- Category mappings for various development aspects

## Usage

### Running the Facts Server
```bash
cd facts-server
npm start
```

### Interacting with Facts

The facts server provides the following tools:
- Create/update facts
- Search facts by type, strictness, and version
- Validate content against fact criteria
- Retrieve existing facts

## Technical Details

### System Architecture

```mermaid
graph TB
    subgraph "System Architecture"
        MCP[Model Context Protocol]
        
        subgraph "Facts Management"
            FS[Facts Server]
            DB[(SQLite DB)]
            VS[Vector Search]
        end
        
        subgraph "Validation Layer"
            VP[Validation Processor]
            RC[Rules Configuration]
        end
        
        IDE[Development Environment]
    end
    
    classDef default fill:#f9f9f9,stroke:#333,stroke-width:2px;
    classDef highlight fill:#e1f5fe,stroke:#0288d1,stroke-width:2px;
    class MCP,FS highlight
```

### Request Flow

```mermaid
%%{init: {'sequence': {'width': 400, 'actorMargin': 30, 'messageMargin': 15, 'boxMargin': 10, 'fontSize': 11, 'actorFontSize': 11, 'noteFontSize': 11, 'messageFontSize': 11}}}%%
sequenceDiagram
    participant IDE as Dev Env
    participant MCP as MCP
    participant FS as Facts
    participant DB as DB
    participant VP as Validator

    IDE->>MCP: Dev Request
    MCP->>FS: Query Facts
    FS->>DB: Fetch Rules
    DB-->>FS: Rules Data
    FS->>VP: Validate
    VP-->>FS: Result
    FS-->>MCP: Facts & Valid.
    MCP-->>IDE: Standards
```

The architecture diagram shows the core components of HiveMind, centered around the Model Context Protocol (MCP) which integrates with your development environment. The Facts Server manages development guidelines and standards using a SQLite database with vector search capabilities.

### Project Structure

```
HiveMind/
├── facts-server/        # MCP server for facts management
│   ├── src/            # TypeScript source files
│   ├── prisma/         # Database schema and migrations
│   └── build/          # Compiled JavaScript output
└── .clinerules         # Configuration for facts integration
```

### Technology Stack
- TypeScript
- Prisma (SQLite)
- MCP SDK
- Vector extensions for similarity search

### Development Scripts
- `npm run build` - Build the TypeScript code
- `npm run dev` - Run with debugging enabled
- `npm start` - Start the facts server

## Contributing

Contributions are welcome! Feel free to submit issues, feature requests, or pull requests.

## Contact

You can reach me on:
- https://www.linkedin.com/in/andrewhopper
- https://x.com/andrewhopper
- https://andrewhopper.com

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
