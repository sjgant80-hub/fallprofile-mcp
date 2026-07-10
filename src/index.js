#!/usr/bin/env node
// fallprofile-mcp · MCP stdio server wrapping fallprofile-sdk · MIT · AI-Native Solutions
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const server = new Server({ name: 'fallprofile-mcp', version: '1.0.0' }, { capabilities: { tools: {} } });

const TOOLS = [
  {
    name: 'fallprofile_open_d_b',
    description: 'openDB · from fallprofile-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { openDB } = await import('@ai-native-solutions/fallprofile-sdk');
      return typeof openDB === 'function' ? await openDB(args) : { error: 'openDB not callable' };
    }
  },
  {
    name: 'fallprofile_get_or_create_identity',
    description: 'getOrCreateIdentity · from fallprofile-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { getOrCreateIdentity } = await import('@ai-native-solutions/fallprofile-sdk');
      return typeof getOrCreateIdentity === 'function' ? await getOrCreateIdentity(args) : { error: 'getOrCreateIdentity not callable' };
    }
  },
  {
    name: 'fallprofile_sign_message',
    description: 'signMessage · from fallprofile-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { signMessage } = await import('@ai-native-solutions/fallprofile-sdk');
      return typeof signMessage === 'function' ? await signMessage(args) : { error: 'signMessage not callable' };
    }
  },
  {
    name: 'fallprofile_save_record',
    description: 'saveRecord · from fallprofile-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { saveRecord } = await import('@ai-native-solutions/fallprofile-sdk');
      return typeof saveRecord === 'function' ? await saveRecord(args) : { error: 'saveRecord not callable' };
    }
  },
  {
    name: 'fallprofile_list_records',
    description: 'listRecords · from fallprofile-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { listRecords } = await import('@ai-native-solutions/fallprofile-sdk');
      return typeof listRecords === 'function' ? await listRecords(args) : { error: 'listRecords not callable' };
    }
  },
  {
    name: 'fallprofile_delete_record',
    description: 'deleteRecord · from fallprofile-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { deleteRecord } = await import('@ai-native-solutions/fallprofile-sdk');
      return typeof deleteRecord === 'function' ? await deleteRecord(args) : { error: 'deleteRecord not callable' };
    }
  }
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map(({ handler, ...rest }) => rest)
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const t = TOOLS.find(x => x.name === req.params.name);
  if (!t) throw new Error('unknown tool: ' + req.params.name);
  const result = await t.handler(req.params.arguments || {});
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});

await server.connect(new StdioServerTransport());
console.error('fallprofile-mcp v1.0.0 · stdio ready');
