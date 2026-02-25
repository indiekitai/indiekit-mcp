import { describe, it, expect } from 'vitest';
import { builtinTools } from '../registry.js';

describe('builtinTools', () => {
  it('should have tools defined', () => {
    expect(builtinTools.length).toBeGreaterThan(0);
  });

  it('every tool has required fields', () => {
    for (const tool of builtinTools) {
      expect(tool.name).toBeTruthy();
      expect(tool.description).toBeTruthy();
      expect(tool.package).toBeTruthy();
      expect(tool.inputSchema).toBeDefined();
      expect(tool.mode).toBe('mcp-proxy');
    }
  });

  it('tool names are unique', () => {
    const names = builtinTools.map(t => t.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('covers expected packages', () => {
    const packages = new Set(builtinTools.map(t => t.package));
    expect(packages.has('@indiekitai/pg-inspect')).toBe(true);
    expect(packages.has('@indiekitai/pg-diff')).toBe(true);
    expect(packages.has('@indiekitai/throttled')).toBe(true);
    expect(packages.has('@indiekitai/just')).toBe(true);
    expect(packages.has('@indiekitai/lipgloss')).toBe(true);
  });
});
