/**
 * Auto-discovery: scan node_modules for @indiekitai/* packages
 * that export MCP tool definitions.
 */

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import type { ToolDefinition, McpToolExport } from './types.js';

/**
 * Discover @indiekitai packages that export `./mcp` and call getTools().
 */
export async function discoverTools(basePath?: string): Promise<ToolDefinition[]> {
  const tools: ToolDefinition[] = [];
  const nmPath = basePath
    ? join(basePath, 'node_modules', '@indiekitai')
    : join(process.cwd(), 'node_modules', '@indiekitai');

  let packages: string[];
  try {
    packages = await readdir(nmPath);
  } catch {
    return tools;
  }

  for (const pkg of packages) {
    try {
      const pkgJsonPath = join(nmPath, pkg, 'package.json');
      const pkgJson = JSON.parse(await readFile(pkgJsonPath, 'utf-8'));

      // Check if package exports ./mcp
      const hasMcpExport = pkgJson.exports?.['./mcp'];
      const hasIndiekitMcp = pkgJson.indiekit?.mcp;

      if (!hasMcpExport && !hasIndiekitMcp) continue;

      // Try to dynamically import the mcp module
      const modulePath = hasMcpExport
        ? `@indiekitai/${pkg}/mcp`
        : join(nmPath, pkg, 'dist', 'mcp.js');

      const mod = await import(modulePath) as McpToolExport;
      if (typeof mod.getTools === 'function') {
        const discovered = mod.getTools();
        tools.push(...discovered);
      }
    } catch {
      // Skip packages that fail to load
    }
  }

  return tools;
}
