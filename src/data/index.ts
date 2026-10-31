import mathematicsData from './subjects/mathematics.json';
import physicsData from './subjects/physics.json';
import type { Subject, SubjectMeta, ChapterMeta, Chapter, Question } from '../types';

// Hardcoded repository of subjects.
// To migrate to Supabase in the future:
// Replace these in-memory reads with Supabase client queries (e.g. supabase.from('subjects').select(...)).
const subjectsStore: Subject[] = [
  mathematicsData as unknown as Subject,
  physicsData as unknown as Subject,
];

/**
 * Returns all subjects with full chapter and question trees.
 */
export function getAllSubjects(): Subject[] {
  return subjectsStore;
}

/**
 * Returns metadata for all subjects (including calculated counts).
 */
export function getSubjectMetas(): SubjectMeta[] {
  return subjectsStore.map((subject) => ({
    id: subject.id,
    name: subject.name,
    description: subject.description,
    icon: subject.icon,
    chapterCount: subject.chapters.length,
    questionCount: subject.chapters.reduce(
      (total, ch) => total + ch.questions.length,
      0
    ),
  }));
}

/**
 * Retrieves a single subject by ID.
 */
export function getSubjectById(subjectId: string): Subject | undefined {
  return subjectsStore.find(
    (s) => s.id.toLowerCase() === subjectId.toLowerCase()
  );
}

/**
 * Retrieves metadata for all chapters in a subject.
 */
export function getChaptersForSubject(subjectId: string): ChapterMeta[] {
  const subject = getSubjectById(subjectId);
  if (!subject) return [];

  return subject.chapters.map((ch) => ({
    id: ch.id,
    subjectId: subject.id,
    name: ch.name,
    description: ch.description,
    questionCount: ch.questions.length,
  }));
}

/**
 * Retrieves a specific chapter belonging to a specific subject.
 */
export function getChapterById(
  subjectId: string,
  chapterId: string
): { subject: Subject; chapter: Chapter } | undefined {
  const subject = getSubjectById(subjectId);
  if (!subject) return undefined;

  const chapter = subject.chapters.find(
    (ch) => ch.id.toLowerCase() === chapterId.toLowerCase()
  );
  if (!chapter) return undefined;

  return { subject, chapter };
}

/**
 * Returns overall bank statistics (total subjects, chapters, questions).
 */
export function getOverallStats(): {
  totalSubjects: number;
  totalChapters: number;
  totalQuestions: number;
} {
  let totalChapters = 0;
  let totalQuestions = 0;

  for (const subject of subjectsStore) {
    totalChapters += subject.chapters.length;
    for (const chapter of subject.chapters) {
      totalQuestions += chapter.questions.length;
    }
  }

  return {
    totalSubjects: subjectsStore.length,
    totalChapters,
    totalQuestions,
  };
}

/**
 * Search questions across all subjects and chapters by text, tag, or difficulty.
 */
export function searchQuestions(query: string): Array<{
  subject: Subject;
  chapter: Chapter;
  question: Question;
}> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: Array<{
    subject: Subject;
    chapter: Chapter;
    question: Question;
  }> = [];

  for (const subject of subjectsStore) {
    for (const chapter of subject.chapters) {
      for (const question of chapter.questions) {
        const matchesText =
          question.question.toLowerCase().includes(q) ||
          question.answer.toLowerCase().includes(q) ||
          question.solution.toLowerCase().includes(q);
        const matchesTag = question.tags.some((t) => t.toLowerCase().includes(q));
        const matchesDifficulty = question.difficulty.toLowerCase() === q;

        if (matchesText || matchesTag || matchesDifficulty) {
          results.push({ subject, chapter, question });
        }
      }
    }
  }

  return results;
}
