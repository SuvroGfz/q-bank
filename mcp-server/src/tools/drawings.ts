/**
 * MCP tools for Artboard drawing operations.
 * Calls the Artboard REST API via the HTTP client.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { artboardClient } from '../clients/artboard.js';

export function registerDrawingTools(server: McpServer): void {
  server.tool(
    'list_drawings',
    'List all saved drawings from the Artboard service',
    {},
    async () => {
      const drawings = await artboardClient.listDrawings();
      return {
        content: [{ type: 'text', text: JSON.stringify(drawings, null, 2) }],
      };
    }
  );

  server.tool(
    'get_drawing',
    'Get the full details of a drawing including all elements',
    { drawingId: z.string().describe('The drawing ID') },
    async ({ drawingId }) => {
      try {
        const drawing = await artboardClient.getDrawing(drawingId);
        return {
          content: [{ type: 'text', text: JSON.stringify(drawing, null, 2) }],
        };
      } catch {
        return { content: [{ type: 'text', text: `Drawing "${drawingId}" not found` }] };
      }
    }
  );

  server.tool(
    'create_drawing',
    'Create a new blank drawing in the Artboard service',
    { title: z.string().describe('Title for the new drawing') },
    async ({ title }) => {
      const drawing = await artboardClient.createDrawing(title);
      return {
        content: [{
          type: 'text',
          text: `Created drawing "${drawing.title}" with id: ${drawing.id}`,
        }],
      };
    }
  );

  server.tool(
    'add_elements',
    'Add Excalidraw elements (shapes, text, arrows, lines) to an existing drawing. Each element needs at minimum: type, x, y. Supported types: rectangle, ellipse, diamond, text, line, arrow, freedraw.',
    {
      drawingId: z.string().describe('The drawing ID to add elements to'),
      elements: z.array(z.object({
        type: z.enum(['rectangle', 'ellipse', 'diamond', 'text', 'line', 'arrow', 'freedraw'])
          .describe('Element type'),
        x: z.number().describe('X coordinate'),
        y: z.number().describe('Y coordinate'),
        width: z.number().optional().describe('Width (for shapes)'),
        height: z.number().optional().describe('Height (for shapes)'),
        text: z.string().optional().describe('Text content (for text elements)'),
        fontSize: z.number().optional().describe('Font size (for text elements)'),
        strokeColor: z.string().optional().describe('Stroke color (hex, e.g. #1e1e1e)'),
        backgroundColor: z.string().optional().describe('Background fill color (hex)'),
        fillStyle: z.enum(['hachure', 'cross-hatch', 'solid']).optional()
          .describe('Fill style for shapes'),
        strokeWidth: z.number().optional().describe('Stroke width in pixels'),
        points: z.array(z.array(z.number())).optional()
          .describe('Array of [x,y] points for lines and arrows'),
        roughness: z.number().optional().describe('0 = smooth, 1 = artist, 2 = cartoonist'),
      })).describe('Array of Excalidraw element objects to add'),
    },
    async ({ drawingId, elements }) => {
      try {
        const drawing = await artboardClient.addElements(drawingId, elements);
        return {
          content: [{
            type: 'text',
            text: `Added ${elements.length} element(s) to "${drawing.title}". Drawing now has ${drawing.elements.length} total elements.`,
          }],
        };
      } catch (e) {
        return {
          content: [{ type: 'text', text: `Failed to add elements: ${e instanceof Error ? e.message : String(e)}` }],
        };
      }
    }
  );

  server.tool(
    'delete_drawing',
    'Delete a drawing from the Artboard service',
    { drawingId: z.string().describe('The drawing ID to delete') },
    async ({ drawingId }) => {
      try {
        await artboardClient.deleteDrawing(drawingId);
        return { content: [{ type: 'text', text: `Deleted drawing ${drawingId}` }] };
      } catch {
        return { content: [{ type: 'text', text: `Drawing "${drawingId}" not found` }] };
      }
    }
  );

  server.tool(
    'export_drawing',
    'Export a drawing in Excalidraw-compatible JSON format',
    {
      drawingId: z.string().describe('The drawing ID to export'),
      format: z.enum(['json']).optional().describe('Export format (currently only json)'),
    },
    async ({ drawingId, format }) => {
      try {
        const data = await artboardClient.exportDrawing(drawingId, format ?? 'json');
        return {
          content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
        };
      } catch {
        return { content: [{ type: 'text', text: `Drawing "${drawingId}" not found` }] };
      }
    }
  );
}
