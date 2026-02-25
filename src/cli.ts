#!/usr/bin/env node

import { getAllTools, startServer } from './server.js';

const args = process.argv.slice(2);

if (args.includes('--list')) {
  const tools = await getAllTools();
  console.log(`\n🧰 IndieKit MCP Tools (${tools.length} available)\n`);
  const byPackage = new Map<string, typeof tools>();
  for (const t of tools) {
    const pkg = byPackage.get(t.package) ?? [];
    pkg.push(t);
    byPackage.set(t.package, pkg);
  }
  for (const [pkg, pkgTools] of byPackage) {
    console.log(`📦 ${pkg}`);
    for (const t of pkgTools) {
      console.log(`   • ${t.name} — ${t.description}`);
    }
    console.log();
  }
  process.exit(0);
}

if (args.includes('--config')) {
  const config = {
    mcpServers: {
      indiekit: {
        command: 'npx',
        args: ['@indiekitai/mcp'],
      },
    },
  };
  console.log(JSON.stringify(config, null, 2));
  process.exit(0);
}

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
indiekit-mcp — Unified MCP server for all IndieKit tools

Usage:
  indiekit-mcp          Start the MCP server (stdio transport)
  indiekit-mcp --list   List all available tools
  indiekit-mcp --config Show Claude Desktop / Cursor config JSON
  indiekit-mcp --help   Show this help
`);
  process.exit(0);
}

// Default: start MCP server
await startServer();
