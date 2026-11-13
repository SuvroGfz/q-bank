/**
 * MCP tools for QBank question operations.
 * Reads from QBank's JSON data files directly.
 */

import { z } from 'zod';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

// Path to QBank's data directory (relative to mcp-server/)
const DATA_DIR = path.resolve(import.meta.dirname ?? '.', '../../src/data/subjects');

interface Question {
  id: string;
  serial: number;
  question: string;
  answer: string;
  solution: string;
  difficulty: string;
  typeId?: string;
  tags: string[];
  drawingIds?: string[];
}

interface Chapter {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}

interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  chapters: Chapter[];
}

async function loadSubjects(): Promise<Subject[]> {
  const { readdir } = await import('node:fs/promises');
  const files = await readdir(DATA_DIR);
  const subjects: Subject[] = [];

  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    try {
      const raw = await readFile(path.join(DATA_DIR, file), 'utf-8');
      subjects.push(JSON.parse(raw) as Subject);
    } catch {
      // skip
    }
  }

  return subjects;
}

export function registerQuestionTools(server: McpServer): void {
  server.tool(
    'list_subjects',
    'List all subjects in the question bank with chapter and question counts',
    {},
    async () => {
      const subjects = await loadSubjects();
      const result = subjects.map((s) => ({
        id: s.id,
        name: s.name,
        description: s.description,
        icon: s.icon,
        chapterCount: s.chapters.length,
        questionCount: s.chapters.reduce((sum, ch) => sum + ch.questions.length, 0),
      }));

      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    'list_chapters',
    'List all chapters in a specific subject',
    { subjectId: z.string().describe('The subject ID') },
    async ({ subjectId }) => {
      const subjects = await loadSubjects();
      const subject = subjects.find((s) => s.id.toLowerCase() === subjectId.toLowerCase());

      if (!subject) {
        return { content: [{ type: 'text', text: `Subject "${subjectId}" not found` }] };
      }

      const result = subject.chapters.map((ch) => ({
        id: ch.id,
        name: ch.name,
        description: ch.description,
        questionCount: ch.questions.length,
      }));

      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    'list_questions',
    'List all questions in a specific chapter of a subject',
    {
      subjectId: z.string().describe('The subject ID'),
      chapterId: z.string().describe('The chapter ID'),
    },
    async ({ subjectId, chapterId }) => {
      const subjects = await loadSubjects();
      const subject = subjects.find((s) => s.id.toLowerCase() === subjectId.toLowerCase());
      if (!subject) {
        return { content: [{ type: 'text', text: `Subject "${subjectId}" not found` }] };
      }

      const chapter = subject.chapters.find((ch) => ch.id.toLowerCase() === chapterId.toLowerCase());
      if (!chapter) {
        return { content: [{ type: 'text', text: `Chapter "${chapterId}" not found` }] };
      }

      const result = chapter.questions.map((q) => ({
        id: q.id,
        serial: q.serial,
        question: q.question.substring(0, 100) + (q.question.length > 100 ? '…' : ''),
        difficulty: q.difficulty,
        tags: q.tags,
        drawingIds: q.drawingIds ?? [],
      }));

      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    'get_question',
    'Get the full details of a specific question including answer and solution',
    {
      subjectId: z.string().describe('The subject ID'),
      chapterId: z.string().describe('The chapter ID'),
      questionId: z.string().describe('The question ID'),
    },
    async ({ subjectId, chapterId, questionId }) => {
      const subjects = await loadSubjects();
      const subject = subjects.find((s) => s.id.toLowerCase() === subjectId.toLowerCase());
      if (!subject) {
        return { content: [{ type: 'text', text: `Subject "${subjectId}" not found` }] };
      }

      const chapter = subject.chapters.find((ch) => ch.id.toLowerCase() === chapterId.toLowerCase());
      if (!chapter) {
        return { content: [{ type: 'text', text: `Chapter "${chapterId}" not found` }] };
      }

      const question = chapter.questions.find((q) => q.id === questionId);
      if (!question) {
        return { content: [{ type: 'text', text: `Question "${questionId}" not found` }] };
      }

      return {
        content: [{ type: 'text', text: JSON.stringify(question, null, 2) }],
      };
    }
  );

  server.tool(
    'search_questions',
    'Search questions across all subjects by text, tag, or difficulty',
    { query: z.string().describe('Search query (text, tag name, or difficulty level)') },
    async ({ query }) => {
      const q = query.trim().toLowerCase();
      if (!q) {
        return { content: [{ type: 'text', text: 'Empty query' }] };
      }

      const subjects = await loadSubjects();
      const results: Array<{ subjectId: string; chapterId: string; question: Question }> = [];

      for (const subject of subjects) {
        for (const chapter of subject.chapters) {
          for (const question of chapter.questions) {
            const matchesText =
              question.question.toLowerCase().includes(q) ||
              question.answer.toLowerCase().includes(q);
            const matchesTag = question.tags.some((t) => t.toLowerCase().includes(q));
            const matchesDifficulty = question.difficulty.toLowerCase() === q;

            if (matchesText || matchesTag || matchesDifficulty) {
              results.push({ subjectId: subject.id, chapterId: chapter.id, question });
            }
          }
        }
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify(
            results.slice(0, 20).map((r) => ({
              subjectId: r.subjectId,
              chapterId: r.chapterId,
              id: r.question.id,
              question: r.question.question.substring(0, 100),
              difficulty: r.question.difficulty,
              tags: r.question.tags,
            })),
            null,
            2
          ),
        }],
      };
    }
  );
}
