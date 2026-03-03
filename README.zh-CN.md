[English](README.md) | [中文](README.zh-CN.md)

# @indiekitai/mcp

统一 MCP server，自动发现并暴露所有 [IndieKit](https://github.com/indiekitai) 工具，只需一个端点。

一份配置，所有工具。

## 快速配置

**Claude Desktop / Cursor：**

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

或生成配置：

```bash
npx @indiekitai/mcp --config
```

## 可用工具（16 个）

### 📊 PostgreSQL

| 工具 | 包 | 说明 |
|------|-----|------|
| `pg_inspect_schema` | @indiekitai/pg-inspect | 检查数据库 schema — 表、列、索引、约束 |
| `pg_diff_schemas` | @indiekitai/pg-diff | 对比两个数据库并返回迁移 SQL |
| `pg_diff_summary` | @indiekitai/pg-diff | 可读的 diff 摘要 |
| `pg_top_activity` | @indiekitai/pg-top | 当前 pg_stat_activity |
| `pg_top_stats` | @indiekitai/pg-top | 数据库统计（连接数、缓存命中率、TPS） |
| `pg_top_locks` | @indiekitai/pg-top | 当前锁信息 |

### ⚡ 开发工具

| 工具 | 包 | 说明 |
|------|-----|------|
| `just_list_recipes` | @indiekitai/just | 列出 justfile recipe |
| `just_run_recipe` | @indiekitai/just | 执行 justfile recipe |
| `just_parse_justfile` | @indiekitai/just | 解析 justfile 为 AST |
| `throttled_check_rate` | @indiekitai/throttled | 检查速率限制状态 |
| `throttled_get_status` | @indiekitai/throttled | 获取速率限制状态（不消耗配额） |
| `env_audit_scan` | @indiekitai/env-audit | 扫描项目中的环境变量 |
| `llm_context_scan` | @indiekitai/llm-context | 统计 token 数，用于 LLM 上下文估算 |

### 🎨 终端 UI

| 工具 | 包 | 说明 |
|------|-----|------|
| `lipgloss_style_render` | @indiekitai/lipgloss | 渲染带样式的终端文本 |
| `lipgloss_join_horizontal` | @indiekitai/lipgloss | 水平拼接文本块 |
| `lipgloss_join_vertical` | @indiekitai/lipgloss | 垂直堆叠文本块 |

## CLI

```bash
npx @indiekitai/mcp            # 启动 MCP server（stdio）
npx @indiekitai/mcp --list     # 列出所有工具
npx @indiekitai/mcp --config   # 输出 Claude Desktop 配置 JSON
```

## 自动发现

server 会自动发现已安装的 `@indiekitai/*` 包中导出 MCP 工具定义的包：

1. 扫描 `node_modules/@indiekitai/*/package.json`
2. 检查是否有 `exports["./mcp"]` 或 `indiekit.mcp: true`
3. 动态导入并注册发现的工具

### 为你的包添加工具

从包的 MCP 模块导出 `getTools()` 函数：

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
      // 工具实现
      return { result: 'done' };
    },
  }];
}
```

然后在 `package.json` 中添加：

```json
{
  "exports": {
    "./mcp": "./dist/mcp.js"
  }
}
```

## License

MIT
