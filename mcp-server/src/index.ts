/**
 * QBank MCP Server
 *
 * A single MCP server that gives AI agents access to:
 * - Question bank CRUD (reads/writes QBank JSON data)
 * - Drawing management (calls Artboard REST API)
 * - Drawing ↔ Question linking
 *
 * Usage:
 *   npx tsx src/index.ts
 *
 * Register in MCP config:
 *   {
 *     "mcpServers": {
 *       "qbank": {
 *         "command": "npx",
 *         "args": ["tsx", "/path/to/qbank/mcp-server/src/index.ts"]
 *       }
 *     }
 *   }
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerQuestionTools } from './tools/questions.js';
import { registerDrawingTools } from './tools/drawings.js';
import { registerLinkingTools } from './tools/linking.js';

const server = new McpServer({
  name: 'qbank',
  version: '0.1.0',
});

// Register all tool groups
registerQuestionTools(server);
registerDrawingTools(server);
registerLinkingTools(server);

// Start on stdio
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('🎓 QBank MCP Server running on stdio');
  console.error('   Tools: questions (5) + drawings (6) + linking (3) = 14 tools');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
