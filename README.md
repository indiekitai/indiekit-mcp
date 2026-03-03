[English](README.md) | [中文](README.zh-CN.md)

# @indiekitai/mcp

Unified MCP server that auto-discovers and exposes all [IndieKit](https://github.com/indiekitai) tools through a single endpoint.

One config, all tools.

## Quick Setup

**Claude Desktop / Cursor:**

```json
{
  "mcpServers": {
    "indiekit": {
      "command": "npx",
      "args": ["@indiekitai/mcp"]
    }
  }
}
```

Or generate the config:

```bash
npx @indiekitai/mcp --config
```

## Available Tools (16)

### 📊 PostgreSQL

| Tool | Package | Description |
|------|---------|-------------|
| `pg_inspect_schema` | @indiekitai/pg-inspect | Inspect database schema — tables, columns, indexes, constraints |
| `pg_diff_schemas` | @indiekitai/pg-diff | Compare two databases and return migration SQL |
| `pg_diff_summary` | @indiekitai/pg-diff | Human-readable diff summary |
| `pg_top_activity` | @indiekitai/pg-top | Current pg_stat_activity |
| `pg_top_stats` | @indiekitai/pg-top | Database statistics (connections, cache hit, TPS) |
| `pg_top_locks` | @indiekitai/pg-top | Current lock information |

### ⚡ Development

| Tool | Package | Description |
|------|---------|-------------|
| `just_list_recipes` | @indiekitai/just | List justfile recipes |
| `just_run_recipe` | @indiekitai/just | Execute a justfile recipe |
| `just_parse_justfile` | @indiekitai/just | Parse justfile to AST |
| `throttled_check_rate` | @indiekitai/throttled | Check rate limit status |
| `throttled_get_status` | @indiekitai/throttled | Get rate limit state without consuming quota |
| `env_audit_scan` | @indiekitai/env-audit | Scan project for environment variables |
| `llm_context_scan` | @indiekitai/llm-context | Count tokens for LLM context estimation |

### 🎨 Terminal UI

| Tool | Package | Description |
|------|---------|-------------|
| `lipgloss_style_render` | @indiekitai/lipgloss | Render styled terminal text |
| `lipgloss_join_horizontal` | @indiekitai/lipgloss | Join text blocks horizontally |
| `lipgloss_join_vertical` | @indiekitai/lipgloss | Join text blocks vertically |

## CLI

```bash
npx @indiekitai/mcp            # Start MCP server (stdio)
npx @indiekitai/mcp --list     # List all tools
npx @indiekitai/mcp --config   # Claude Desktop config JSON
```

## Auto-Discovery

The server automatically discovers additional tools from installed `@indiekitai/*` packages that export MCP tool definitions:

1. Scans `node_modules/@indiekitai/*/package.json`
2. Checks for `exports["./mcp"]` or `indiekit.mcp: true` in package.json
3. Dynamically imports and registers discovered tools

### Adding Tools to Your Package

Export a `getTools()` function from your package's MCP module:

```typescript
// src/mcp.ts
import type { ToolDefinition } from '@indiekitai/mcp';

export function getTools(): ToolDefinition[] {
  return [{
    name: 'my_tool',
    description: 'Does something useful',
    package: '@indiekitai/my-package',
    mode: 'direct',
    inputSchema: {
      type: 'object',
      properties: {
        input: { type: 'string', description: 'Input value' },
      },
      required: ['input'],
    },
    handler: async (params) => {
      // Tool implementation
      return { result: 'done' };
    },
  }];
}
```

Then add to your `package.json`:

```json
{
  "exports": {
    "./mcp": "./dist/mcp.js"
  }
}
```

## License

MIT
