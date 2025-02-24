# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-02-24

### Added
- Initial release of the Hivemind MCP Server
- Prisma-based SQLite storage for facts
- MCP tools for managing development knowledge:
  - get_all_facts
  - get_fact
  - search_facts
  - set_fact
  - validate_criteria
- Pre-defined seed data for:
  - Frontend practices (React, Next.js, styling)
  - Backend patterns (Python, FastCGI, MVC)
  - Database requirements (PostgreSQL, ORMs)
  - Architecture decisions
  - Documentation standards
  - Development tooling
- Automatic database seeding functionality
- Full TypeScript support
- Comprehensive documentation

### Dependencies
- Node.js >=18.0.0
- @modelcontextprotocol/sdk ^1.5.0
- @prisma/client ^6.4.1
- sqlite-vec ^0.1.7-alpha.2
- sqlite3 ^5.1.7
