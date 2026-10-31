import { describe, it, expect, vi } from 'vitest';
import { downloadChapterJson, downloadQuestionTemplate } from '../lib/jsonExport';
import type { Subject, Chapter } from '../types';

describe('JSON Export utilities', () => {
  it('triggers download for chapter json', () => {
    const appendSpy = vi.spyOn(document.body, 'appendChild');
    const removeSpy = vi.spyOn(HTMLAnchorElement.prototype, 'remove');

    const mockSubject: Subject = {
      id: 'math',
      name: 'Mathematics',
      description: 'Desc',
      icon: '📐',
      chapters: [],
    };

    const mockChapter: Chapter = {
      id: 'algebra',
      name: 'Algebra',
      description: 'Ch Desc',
      questions: [],
    };

    downloadChapterJson(mockSubject, mockChapter);

    expect(appendSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();

    appendSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it('triggers download for question template', () => {
    const appendSpy = vi.spyOn(document.body, 'appendChild');
    const removeSpy = vi.spyOn(HTMLAnchorElement.prototype, 'remove');

    downloadQuestionTemplate('Sample Chapter');

    expect(appendSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();

    appendSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
