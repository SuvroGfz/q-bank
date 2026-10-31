import type { Chapter, Subject } from '../types';

/**
 * Triggers a browser download of a JSON object as a formatted .json file.
 */
export function downloadJsonFile(data: unknown, filename: string): void {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(data, null, 2)
  )}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Downloads the current chapter data (including math types & questions).
 */
export function downloadChapterJson(subject: Subject, chapter: Chapter): void {
  const payload = {
    subjectId: subject.id,
    subjectName: subject.name,
    chapter: {
      id: chapter.id,
      name: chapter.name,
      description: chapter.description,
      mathTypes: chapter.mathTypes || [],
      questions: chapter.questions,
    },
    exportedAt: new Date().toISOString(),
    schemaVersion: '1.0',
  };

  const filename = `${subject.id}-${chapter.id}-questions.json`;
  downloadJsonFile(payload, filename);
}

/**
 * Downloads a clean blank question template for creating new questions.
 */
export function downloadQuestionTemplate(chapterName: string): void {
  const template = {
    chapterName: chapterName || 'Sample Chapter',
    instructions:
      'Fill in this JSON array with new questions. Use LaTeX $...$ for inline math and $$...$$ for display math.',
    sampleQuestions: [
      {
        id: 'q-custom-001',
        serial: 1,
        typeId: 'quadratic',
        question: 'Solve for x: $$x^2 - 5x + 6 = 0$$',
        answer: '$$x = 2 \\quad \\text{or} \\quad x = 3$$',
        solution:
          '**Step 1:** Factor the polynomial into $(x - 2)(x - 3) = 0$.\n**Step 2:** Set each factor to zero to obtain $x = 2, 3$.',
        difficulty: 'easy',
        tags: ['algebra', 'factoring'],
      },
    ],
  };

  downloadJsonFile(template, 'qbank-questions-template.json');
}
