/**
 * Built-in registry of known @indiekitai tools.
 * Each entry describes the tool and how to invoke it via MCP proxy.
 */

import type { ToolDefinition } from './types.js';

export const builtinTools: ToolDefinition[] = [
  // === @indiekitai/pg-inspect ===
  {
    name: 'pg_inspect_schema',
    description: 'Inspect PostgreSQL database schema — tables, columns, types, indexes, constraints, enums, and extensions',
    package: '@indiekitai/pg-inspect',
    mode: 'mcp-proxy',
    command: 'npx',
    args: ['@indiekitai/pg-inspect', '--mcp'],
    inputSchema: {
      type: 'object',
      properties: {
        connectionString: { type: 'string', description: 'PostgreSQL connection string (defaults to DATABASE_URL)' },
      },
    },
  },

  // === @indiekitai/pg-diff ===
  {
    name: 'pg_diff_schemas',
    description: 'Compare two PostgreSQL databases and return migration SQL',
    package: '@indiekitai/pg-diff',
    mode: 'mcp-proxy',
    command: 'npx',
    args: ['@indiekitai/pg-diff', '--mcp'],
    inputSchema: {
      type: 'object',
      properties: {
        fromUrl: { type: 'string', description: 'Source database connection string' },
        toUrl: { type: 'string', description: 'Target database connection string' },
        safe: { type: 'boolean', description: 'Omit DROP statements' },
      },
      required: ['fromUrl', 'toUrl'],
    },
  },
  {
    name: 'pg_diff_summary',
    description: 'Compare two PostgreSQL databases and return a human-readable summary of differences',
    package: '@indiekitai/pg-diff',
    mode: 'mcp-proxy',
    command: 'npx',
    args: ['@indiekitai/pg-diff', '--mcp'],
    inputSchema: {
      type: 'object',
      properties: {
        fromUrl: { type: 'string', description: 'Source database connection string' },
        toUrl: { type: 'string', description: 'Target database connection string' },
        safe: { type: 'boolean', description: 'Omit DROP statements' },
      },
      required: ['fromUrl', 'toUrl'],
    },
  },

  // === @indiekitai/pg-top ===
  {
    name: 'pg_top_activity',
    description: 'Get current PostgreSQL activity from pg_stat_activity',
    package: '@indiekitai/pg-top',
    mode: 'mcp-proxy',
    command: 'npx',
    args: ['@indiekitai/pg-top', '--mcp'],
    inputSchema: {
      type: 'object',
      properties: {
        connectionString: { type: 'string', description: 'PostgreSQL connection string' },
        no_idle: { type: 'boolean', description: 'Exclude idle connections' },
      },
    },
  },
  {
    name: 'pg_top_stats',
    description: 'Get database statistics (connections, cache hit ratio, TPS)',
    package: '@indiekitai/pg-top',
    mode: 'mcp-proxy',
    command: 'npx',
    args: ['@indiekitai/pg-top', '--mcp'],
    inputSchema: {
      type: 'object',
      properties: {
        connectionString: { type: 'string', description: 'PostgreSQL connection string' },
      },
    },
  },
  {
    name: 'pg_top_locks',
    description: 'Get current lock information from pg_locks',
    package: '@indiekitai/pg-top',
    mode: 'mcp-proxy',
    command: 'npx',
    args: ['@indiekitai/pg-top', '--mcp'],
    inputSchema: {
      type: 'object',
      properties: {
        connectionString: { type: 'string', description: 'PostgreSQL connection string' },
      },
    },
  },

  // === @indiekitai/throttled ===
  {
    name: 'throttled_check_rate',
    description: 'Check if a key is rate limited using configurable algorithms (token-bucket, leaky-bucket, fixed-window, sliding-window, gcra)',
    package: '@indiekitai/throttled',
    mode: 'mcp-proxy',
    command: 'npx',
    args: ['@indiekitai/throttled', '--mcp'],
    inputSchema: {
      type: 'object',
      properties: {
        key: { type: 'string', description: 'Rate limit key (e.g. user id, IP)' },
        algorithm: { type: 'string', enum: ['token-bucket', 'leaky-bucket', 'fixed-window', 'sliding-window', 'gcra'] },
        limit: { type: 'number', description: 'Max requests per period (default: 10)' },
        period: { type: 'string', description: 'Period string e.g. 1s, 1m, 1h (default: 1s)' },
        cost: { type: 'number', description: 'Cost of this request (default: 1)' },
      },
      required: ['key'],
    },
  },
  {
    name: 'throttled_get_status',
    description: 'Get current rate limit state for a key without consuming quota',
    package: '@indiekitai/throttled',
    mode: 'mcp-proxy',
    command: 'npx',
    args: ['@indiekitai/throttled', '--mcp'],
    inputSchema: {
      type: 'object',
      properties: {
        key: { type: 'string', description: 'Rate limit key' },
        algorithm: { type: 'string' },
        limit: { type: 'number' },
        period: { type: 'string' },
      },
      required: ['key'],
    },
  },

  // === @indiekitai/just ===
  {
    name: 'just_list_recipes',
    description: 'List all recipes defined in a justfile',
    package: '@indiekitai/just',
    mode: 'mcp-proxy',
    command: 'npx',
    args: ['@indiekitai/just', '--mcp'],
    inputSchema: {
      type: 'object',
      properties: {
        justfile: { type: 'string', description: 'Path to justfile (auto-detected if omitted)' },
      },
    },
  },
  {
    name: 'just_run_recipe',
    description: 'Execute a recipe from a justfile',
    package: '@indiekitai/just',
    mode: 'mcp-proxy',
    command: 'npx',
    args: ['@indiekitai/just', '--mcp'],
    inputSchema: {
      type: 'object',
      properties: {
        recipe: { type: 'string', description: 'Name of the recipe to run' },
        args: { type: 'array', items: { type: 'string' }, description: 'Arguments to pass' },
        justfile: { type: 'string', description: 'Path to justfile' },
        dryRun: { type: 'boolean', description: 'Print commands without executing' },
      },
      required: ['recipe'],
    },
  },
  {
    name: 'just_parse_justfile',
    description: 'Parse a justfile and return the AST',
    package: '@indiekitai/just',
    mode: 'mcp-proxy',
    command: 'npx',
    args: ['@indiekitai/just', '--mcp'],
    inputSchema: {
      type: 'object',
      properties: {
        justfile: { type: 'string', description: 'Path to justfile' },
      },
    },
  },

  // === @indiekitai/lipgloss ===
  {
    name: 'lipgloss_style_render',
    description: 'Render styled terminal text with colors, bold, italic, borders, padding, margin, alignment',
    package: '@indiekitai/lipgloss',
    mode: 'mcp-proxy',
    command: 'npx',
    args: ['@indiekitai/lipgloss', '--mcp'],
    inputSchema: {
      type: 'object',
      properties: {
        text: { type: 'string', description: 'Text to render' },
        bold: { type: 'boolean' },
        italic: { type: 'boolean' },
        foreground: { type: 'string', description: 'Foreground color (hex or ANSI)' },
        background: { type: 'string', description: 'Background color' },
        width: { type: 'number' },
        border: { type: 'string', enum: ['normal', 'rounded', 'double', 'thick', 'hidden', 'block', 'ascii', 'none'] },
        padding: { type: 'array', items: { type: 'number' } },
        margin: { type: 'array', items: { type: 'number' } },
      },
      required: ['text'],
    },
  },
  {
    name: 'lipgloss_join_horizontal',
    description: 'Join multiple text blocks horizontally',
    package: '@indiekitai/lipgloss',
    mode: 'mcp-proxy',
    command: 'npx',
    args: ['@indiekitai/lipgloss', '--mcp'],
    inputSchema: {
      type: 'object',
      properties: {
        position: { type: 'string', enum: ['top', 'center', 'bottom'] },
        blocks: { type: 'array', items: { type: 'string' } },
      },
      required: ['blocks'],
    },
  },
  {
    name: 'lipgloss_join_vertical',
    description: 'Join multiple text blocks vertically',
    package: '@indiekitai/lipgloss',
    mode: 'mcp-proxy',
    command: 'npx',
    args: ['@indiekitai/lipgloss', '--mcp'],
    inputSchema: {
      type: 'object',
      properties: {
        position: { type: 'string', enum: ['left', 'center', 'right'] },
        blocks: { type: 'array', items: { type: 'string' } },
      },
      required: ['blocks'],
    },
  },

  // === Python tools (via uvx/pipx) ===
  {
    name: 'env_audit_scan',
    description: 'Scan a project directory for environment variables used in code',
    package: '@indiekitai/env-audit',
    mode: 'mcp-proxy',
    command: 'python3',
    args: ['-m', 'env_audit.mcp_server'],
    inputSchema: {
      type: 'object',
      properties: {
        directory: { type: 'string', description: 'Directory to scan' },
      },
      required: ['directory'],
    },
  },
  {
    name: 'llm_context_scan',
    description: 'Scan files/directories and count tokens for LLM context window estimation',
    package: '@indiekitai/llm-context',
    mode: 'mcp-proxy',
    command: 'python3',
    args: ['-m', 'llm_context.mcp_server'],
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'File or directory to scan' },
        model: { type: 'string', description: 'Model name for context window check' },
      },
      required: ['path'],
    },
  },
];
