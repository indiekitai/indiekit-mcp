/**
 * MCP Proxy: spawns a child MCP server and forwards a single tool call.
 * Uses stdio transport to communicate with the child.
 */

import { spawn } from 'child_process';
import type { ToolDefinition } from './types.js';

interface JsonRpcResponse {
  jsonrpc: '2.0';
  id: number;
  result?: { content: Array<{ type: string; text: string }> };
  error?: { code: number; message: string };
}

/**
 * Call a tool on a child MCP server via stdio JSON-RPC.
 */
export async function proxyToolCall(
  tool: ToolDefinition,
  toolName: string,
  args: Record<string, unknown>,
): Promise<{ content: Array<{ type: 'text'; text: string }>; isError?: boolean }> {
  if (!tool.command) {
    return { content: [{ type: 'text', text: 'Tool has no command configured' }], isError: true };
  }

  return new Promise((resolve) => {
    const child = spawn(tool.command!, tool.args ?? [], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, ...tool.env },
    });

    let stdout = '';
    let stderr = '';
    const timeout = setTimeout(() => {
      child.kill();
      resolve({ content: [{ type: 'text', text: `Timeout calling ${toolName}` }], isError: true });
    }, 30000);

    child.stdout.on('data', (d) => { stdout += d; });
    child.stderr.on('data', (d) => { stderr += d; });

    // Send initialize
    const initMsg = JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'indiekit-mcp', version: '0.1.0' },
    } }) + '\n';

    // Send tools/call
    // Map tool name back to the original name in the child server
    const originalName = toolName.includes('_') 
      ? toolName.replace(/^[^_]+_/, '') // strip prefix like "pg_diff_" -> but this is fragile
      : toolName;

    const callMsg = JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: {
      name: toolName,
      arguments: args,
    } }) + '\n';

    child.stdin.write(initMsg);
    
    // Wait a bit for init response, then send call
    setTimeout(() => {
      child.stdin.write(callMsg);
      // Give it time to respond, then close
      setTimeout(() => {
        child.stdin.end();
      }, 500);
    }, 500);

    child.on('close', () => {
      clearTimeout(timeout);
      // Try to parse the last JSON-RPC response
      const lines = stdout.split('\n').filter(Boolean);
      for (let i = lines.length - 1; i >= 0; i--) {
        try {
          const resp = JSON.parse(lines[i]) as JsonRpcResponse;
          if (resp.id === 2 && resp.result) {
            resolve(resp.result as any);
            return;
          }
          if (resp.error) {
            resolve({ content: [{ type: 'text', text: resp.error.message }], isError: true });
            return;
          }
        } catch { /* not json */ }
      }
      resolve({ content: [{ type: 'text', text: stderr || 'No response from tool server' }], isError: true });
    });
  });
}
