"""
IndieKit MCP Server
Exposes IndieKit tools to AI agents via Model Context Protocol
"""

import asyncio
import httpx
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

# IndieKit API endpoints
INDIEKIT_BASE = "https://indiekit.ai"
HN_API = "https://hn.indiekit.ai"
UPTIME_API = "https://up.indiekit.ai"
TINYLINK_API = "https://s.indiekit.ai"
PASTE_API = "https://p.indiekit.ai"
WEBHOOK_API = "https://hook.indiekit.ai"

server = Server("indiekit-mcp")


@server.list_tools()
async def list_tools() -> list[Tool]:
    """List available IndieKit tools."""
    return [
        Tool(
            name="hn_digest",
            description="获取 Hacker News 每日中文摘要。返回今日热门文章的 AI 生成摘要。",
            inputSchema={
                "type": "object",
                "properties": {
                    "date": {
                        "type": "string",
                        "description": "日期，格式 YYYY-MM-DD。留空获取今日摘要。"
                    },
                    "format": {
                        "type": "string",
                        "enum": ["json", "markdown"],
                        "description": "输出格式，默认 json"
                    }
                }
            }
        ),
        Tool(
            name="uptime_check",
            description="检查网站或 API 是否在线。返回状态、响应时间和可用率。",
            inputSchema={
                "type": "object",
                "properties": {
                    "url": {
                        "type": "string",
                        "description": "要检查的 URL"
                    }
                }
            }
        ),
        Tool(
            name="uptime_status",
            description="获取所有监控端点的状态概览。",
            inputSchema={
                "type": "object",
                "properties": {}
            }
        ),
        Tool(
            name="shorten_url",
            description="创建短链接。将长 URL 转换为短链接，支持点击统计。",
            inputSchema={
                "type": "object",
                "properties": {
                    "url": {
                        "type": "string",
                        "description": "要缩短的原始 URL"
                    },
                    "custom_code": {
                        "type": "string",
                        "description": "自定义短码（可选）"
                    }
                },
                "required": ["url"]
            }
        ),
        Tool(
            name="get_link_stats",
            description="获取短链接的点击统计。",
            inputSchema={
                "type": "object",
                "properties": {
                    "code": {
                        "type": "string",
                        "description": "短链接代码"
                    }
                },
                "required": ["code"]
            }
        ),
        Tool(
            name="create_paste",
            description="创建代码片段分享。支持语法高亮，可设置过期时间。",
            inputSchema={
                "type": "object",
                "properties": {
                    "content": {
                        "type": "string",
                        "description": "要分享的代码或文本内容"
                    },
                    "language": {
                        "type": "string",
                        "description": "编程语言（用于语法高亮），如 python, javascript, go"
                    },
                    "expires_in": {
                        "type": "integer",
                        "description": "过期时间（秒），默认 7 天"
                    }
                },
                "required": ["content"]
            }
        ),
        Tool(
            name="get_paste",
            description="获取已创建的代码片段。",
            inputSchema={
                "type": "object",
                "properties": {
                    "id": {
                        "type": "string",
                        "description": "粘贴 ID"
                    }
                },
                "required": ["id"]
            }
        ),
    ]


@server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    """Execute an IndieKit tool."""
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            if name == "hn_digest":
                date = arguments.get("date", "")
                fmt = arguments.get("format", "json")
                
                if fmt == "markdown":
                    url = f"{HN_API}/digest/markdown"
                elif date:
                    url = f"{HN_API}/digests/{date}"
                else:
                    url = f"{HN_API}/digest"
                
                resp = await client.get(url)
                return [TextContent(type="text", text=resp.text)]
            
            elif name == "uptime_check":
                url = arguments.get("url", "")
                if not url:
                    return [TextContent(type="text", text="错误：需要提供 URL")]
                
                # 直接检查 URL
                try:
                    check_resp = await client.get(url, follow_redirects=True)
                    return [TextContent(
                        type="text",
                        text=f"状态: {'在线' if check_resp.status_code < 400 else '异常'}\n"
                             f"状态码: {check_resp.status_code}\n"
                             f"响应时间: {check_resp.elapsed.total_seconds() * 1000:.0f}ms"
                    )]
                except Exception as e:
                    return [TextContent(type="text", text=f"状态: 离线\n错误: {str(e)}")]
            
            elif name == "uptime_status":
                resp = await client.get(f"{UPTIME_API}/status")
                return [TextContent(type="text", text=resp.text)]
            
            elif name == "shorten_url":
                url = arguments.get("url")
                custom_code = arguments.get("custom_code")
                
                payload = {"url": url}
                if custom_code:
                    payload["custom_code"] = custom_code
                
                resp = await client.post(f"{TINYLINK_API}/api/links", json=payload)
                return [TextContent(type="text", text=resp.text)]
            
            elif name == "get_link_stats":
                code = arguments.get("code")
                resp = await client.get(f"{TINYLINK_API}/api/links/{code}/stats")
                return [TextContent(type="text", text=resp.text)]
            
            elif name == "create_paste":
                content = arguments.get("content")
                language = arguments.get("language", "text")
                expires_in = arguments.get("expires_in")
                
                payload = {"content": content, "language": language}
                if expires_in:
                    payload["expires_in"] = expires_in
                
                resp = await client.post(f"{PASTE_API}/api/paste", json=payload)
                return [TextContent(type="text", text=resp.text)]
            
            elif name == "get_paste":
                paste_id = arguments.get("id")
                resp = await client.get(f"{PASTE_API}/{paste_id}/raw")
                return [TextContent(type="text", text=resp.text)]
            
            else:
                return [TextContent(type="text", text=f"未知工具: {name}")]
                
        except httpx.HTTPError as e:
            return [TextContent(type="text", text=f"HTTP 错误: {str(e)}")]
        except Exception as e:
            return [TextContent(type="text", text=f"错误: {str(e)}")]


def main():
    """Run the MCP server."""
    asyncio.run(stdio_server(server))


if __name__ == "__main__":
    main()
