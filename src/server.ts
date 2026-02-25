/**
 * Unified MCP server that aggregates all IndieKit tools.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { builtinTools } from './registry.js';
import { discoverTools } from './discovery.js';
import { proxyToolCall } from './proxy.js';
import type { ToolDefinition } from './types.js';

export async function getAllTools(): Promise<ToolDefinition[]> {
  const discovered = await discoverTools();
  // Merge: discovered tools override builtin by name
  const byName = new Map<string, ToolDefinition>();
  for (const t of builtinTools) byName.set(t.name, t);
  for (const t of discovered) byName.set(t.name, t);
  return Array.from(byName.values());
}

/**
 * Convert a JSON Schema object to a Zod shape for McpServer.tool().
 * Only handles simple types for now.
 */
function jsonSchemaToZod(schema: Record<string, unknown>): Record<string, z.ZodTypeAny> {
  const properties = (schema.properties ?? {}) as Record<string, any>;
  const required = new Set((schema.required ?? []) as string[]);
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const [key, prop] of Object.entries(properties)) {
    let field: z.ZodTypeAny;
    switch (prop.type) {
      case 'number': field = z.number(); break;
      case 'boolean': field = z.boolean(); break;
      case 'array': field = z.array(z.any()); break;
      default: field = z.string(); break;
    }
    if (prop.description) field = field.describe(prop.description);
    if (!required.has(key)) field = field.optional();
    shape[key] = field;
  }
  return shape;
}

export async function startServer(): Promise<void> {
  const allTools = await getAllTools();

  const server = new McpServer({
    name: 'indiekit',
    version: '0.1.0',
  });

  // Register each tool
  for (const tool of allTools) {
    const zodShape = jsonSchemaToZod(tool.inputSchema);

    server.tool(
      tool.name,
      tool.description,
      zodShape,
      async (params) => {
        if (tool.mode === 'direct' && tool.handler) {
          const result = await tool.handler(params as Record<string, unknown>);
          return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
        }
        // mcp-proxy mode
        return proxyToolCall(tool, tool.name, params as Record<string, unknown>);
      },
    );
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
