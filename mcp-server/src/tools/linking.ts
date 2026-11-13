/**
 * MCP tools for linking drawings to questions.
 * Modifies the QBank JSON data files to add/remove drawingIds.
 */

import { z } from 'zod';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const DATA_DIR = path.resolve(import.meta.dirname ?? '.', '../../src/data/subjects');

interface Question {
  id: string;
  drawingIds?: string[];
  [key: string]: unknown;
}

interface Chapter {
  id: string;
  questions: Question[];
  [key: string]: unknown;
}

interface Subject {
  id: string;
  chapters: Chapter[];
  [key: string]: unknown;
}

async function loadSubjectFile(subjectId: string): Promise<{ subject: Subject; filePath: string } | null> {
  const files = await readdir(DATA_DIR);
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    const fp = path.join(DATA_DIR, file);
    try {
      const raw = await readFile(fp, 'utf-8');
      const subject = JSON.parse(raw) as Subject;
      if (subject.id.toLowerCase() === subjectId.toLowerCase()) {
        return { subject, filePath: fp };
      }
    } catch {
      // skip
    }
  }
  return null;
}

export function registerLinkingTools(server: McpServer): void {
  server.tool(
    'link_drawing',
    'Link a drawing to a question by adding its ID to the question\'s drawingIds array',
    {
      subjectId: z.string().describe('The subject ID containing the question'),
      chapterId: z.string().describe('The chapter ID containing the question'),
      questionId: z.string().describe('The question ID to link the drawing to'),
      drawingId: z.string().describe('The drawing ID to link'),
    },
    async ({ subjectId, chapterId, questionId, drawingId }) => {
      const result = await loadSubjectFile(subjectId);
      if (!result) {
        return { content: [{ type: 'text', text: `Subject "${subjectId}" not found` }] };
      }

      const { subject, filePath } = result;
      const chapter = subject.chapters.find((ch) => ch.id.toLowerCase() === chapterId.toLowerCase());
      if (!chapter) {
        return { content: [{ type: 'text', text: `Chapter "${chapterId}" not found` }] };
      }

      const question = chapter.questions.find((q) => q.id === questionId);
      if (!question) {
        return { content: [{ type: 'text', text: `Question "${questionId}" not found` }] };
      }

      if (!question.drawingIds) {
        question.drawingIds = [];
      }

      if (question.drawingIds.includes(drawingId)) {
        return {
          content: [{ type: 'text', text: `Drawing "${drawingId}" is already linked to question "${questionId}"` }],
        };
      }

      question.drawingIds.push(drawingId);
      await writeFile(filePath, JSON.stringify(subject, null, 2), 'utf-8');

      return {
        content: [{
          type: 'text',
          text: `Linked drawing "${drawingId}" to question "${questionId}". Question now has ${question.drawingIds.length} drawing(s).`,
        }],
      };
    }
  );

  server.tool(
    'unlink_drawing',
    'Remove a drawing link from a question',
    {
      subjectId: z.string().describe('The subject ID'),
      chapterId: z.string().describe('The chapter ID'),
      questionId: z.string().describe('The question ID'),
      drawingId: z.string().describe('The drawing ID to unlink'),
    },
    async ({ subjectId, chapterId, questionId, drawingId }) => {
      const result = await loadSubjectFile(subjectId);
      if (!result) {
        return { content: [{ type: 'text', text: `Subject "${subjectId}" not found` }] };
      }

      const { subject, filePath } = result;
      const chapter = subject.chapters.find((ch) => ch.id.toLowerCase() === chapterId.toLowerCase());
      if (!chapter) {
        return { content: [{ type: 'text', text: `Chapter "${chapterId}" not found` }] };
      }

      const question = chapter.questions.find((q) => q.id === questionId);
      if (!question || !question.drawingIds) {
        return { content: [{ type: 'text', text: `Question "${questionId}" not found or has no drawings` }] };
      }

      const before = question.drawingIds.length;
      question.drawingIds = question.drawingIds.filter((id) => id !== drawingId);

      if (question.drawingIds.length === before) {
        return { content: [{ type: 'text', text: `Drawing "${drawingId}" was not linked to question "${questionId}"` }] };
      }

      await writeFile(filePath, JSON.stringify(subject, null, 2), 'utf-8');

      return {
        content: [{
          type: 'text',
          text: `Unlinked drawing "${drawingId}" from question "${questionId}". ${question.drawingIds.length} drawing(s) remaining.`,
        }],
      };
    }
  );

  server.tool(
    'get_question_drawings',
    'Get all drawing IDs linked to a specific question',
    {
      subjectId: z.string().describe('The subject ID'),
      chapterId: z.string().describe('The chapter ID'),
      questionId: z.string().describe('The question ID'),
    },
    async ({ subjectId, chapterId, questionId }) => {
      const result = await loadSubjectFile(subjectId);
      if (!result) {
        return { content: [{ type: 'text', text: `Subject "${subjectId}" not found` }] };
      }

      const chapter = result.subject.chapters.find((ch) => ch.id.toLowerCase() === chapterId.toLowerCase());
      if (!chapter) {
        return { content: [{ type: 'text', text: `Chapter "${chapterId}" not found` }] };
      }

      const question = chapter.questions.find((q) => q.id === questionId);
      if (!question) {
        return { content: [{ type: 'text', text: `Question "${questionId}" not found` }] };
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            questionId: question.id,
            drawingIds: question.drawingIds ?? [],
            count: (question.drawingIds ?? []).length,
          }, null, 2),
        }],
      };
    }
  );
}
