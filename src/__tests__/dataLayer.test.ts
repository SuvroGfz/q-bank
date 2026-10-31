import { describe, it, expect } from 'vitest';
import {
  getAllSubjects,
  getSubjectMetas,
  getSubjectById,
  getChaptersForSubject,
  getChapterById,
  getOverallStats,
  searchQuestions,
} from '../data';

describe('Data Access Layer', () => {
  it('returns all subjects', () => {
    const subjects = getAllSubjects();
    expect(subjects.length).toBeGreaterThanOrEqual(2);
    expect(subjects.map((s) => s.id)).toContain('mathematics');
    expect(subjects.map((s) => s.id)).toContain('physics');
  });

  it('calculates correct subject metadata', () => {
    const metas = getSubjectMetas();
    const mathMeta = metas.find((m) => m.id === 'mathematics');
    expect(mathMeta).toBeDefined();
    expect(mathMeta?.chapterCount).toBe(5);
    expect(mathMeta?.questionCount).toBeGreaterThan(0);
    expect(mathMeta?.icon).toBe('📐');
  });

  it('finds subject by ID case-insensitively', () => {
    const math = getSubjectById('MATHEMATICS');
    expect(math).toBeDefined();
    expect(math?.name).toBe('Mathematics');

    const nonexistent = getSubjectById('non-existent-subject');
    expect(nonexistent).toBeUndefined();
  });

  it('retrieves chapters for a subject', () => {
    const chapters = getChaptersForSubject('mathematics');
    expect(chapters.length).toBe(5);
    expect(chapters[0].name).toBe('Algebra & Polynomials');
    expect(chapters[0].questionCount).toBeGreaterThan(0);
  });

  it('retrieves specific chapter by subject and chapter ID', () => {
    const res = getChapterById('physics', 'mechanics');
    expect(res).toBeDefined();
    expect(res?.subject.id).toBe('physics');
    expect(res?.chapter.name).toBe('Classical Mechanics');
    expect(res?.chapter.questions.length).toBeGreaterThan(0);
  });

  it('computes overall question bank statistics', () => {
    const stats = getOverallStats();
    expect(stats.totalSubjects).toBe(2);
    expect(stats.totalChapters).toBe(9); // 5 math + 4 physics
    expect(stats.totalQuestions).toBeGreaterThan(15);
  });

  it('searches questions by keyword', () => {
    const results = searchQuestions('quadratic');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].question.question.toLowerCase()).toContain('quadratic');

    const tagResults = searchQuestions('kinematics');
    expect(tagResults.length).toBeGreaterThan(0);
    expect(tagResults[0].question.tags).toContain('kinematics');
  });
});
