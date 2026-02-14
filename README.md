# IndieKit MCP Server

[![PyPI](https://img.shields.io/pypi/v/indiekit-mcp?color=blue)](https://pypi.org/project/indiekit-mcp/)
[![Python](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

让 AI Agent 直接使用 IndieKit 工具。支持 Claude Desktop、Cursor 等 MCP 兼容客户端。

## 安装

```bash
# 使用 uv（推荐）
uv pip install git+https://github.com/indiekit/indiekit-mcp.git

# 或本地安装
git clone https://github.com/indiekit/indiekit-mcp.git
cd indiekit-mcp
uv pip install -e .
```

## 配置 Claude Desktop

编辑 `~/Library/Application Support/Claude/claude_desktop_config.json`（macOS）或 `%APPDATA%\Claude\claude_desktop_config.json`（Windows）：

```json
{
  "mcpServers": {
    "indiekit": {
      "command": "indiekit-mcp"
    }
  }
}
```

重启 Claude Desktop 即可使用。

## 可用工具

| 工具 | 描述 |
|------|------|
| `hn_digest` | 获取 Hacker News 每日中文摘要 |
| `uptime_check` | 检查网站/API 是否在线 |
| `uptime_status` | 获取所有监控端点状态 |
| `shorten_url` | 创建短链接 |
| `get_link_stats` | 获取短链接点击统计 |
| `create_paste` | 创建代码片段分享 |
| `get_paste` | 获取代码片段内容 |

## 使用示例

在 Claude Desktop 中直接说：

- "帮我看看今天 Hacker News 有什么热门"
- "检查一下 https://example.com 是否在线"
- "把这个链接缩短：https://very-long-url.com/..."
- "帮我创建一个 Python 代码片段"

## 本地开发

```bash
cd indiekit-mcp
uv venv
source .venv/bin/activate
uv pip install -e .

# 测试运行
python -m indiekit_mcp
```

## License

MIT
