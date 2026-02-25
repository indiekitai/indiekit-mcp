export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  /** Package that provides this tool */
  package: string;
  /** How to invoke: 'mcp-proxy' spawns the package's MCP server, 'direct' calls handler */
  mode: 'mcp-proxy' | 'direct';
  /** For mcp-proxy mode: command and args to spawn */
  command?: string;
  args?: string[];
  /** For mcp-proxy mode: env vars to pass */
  env?: Record<string, string>;
  /** For direct mode: handler function */
  handler?: (params: Record<string, unknown>) => Promise<unknown>;
}

export interface McpToolExport {
  getTools(): ToolDefinition[];
}
