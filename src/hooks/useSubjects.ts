import { useMemo } from 'react';
import {
  getAllSubjects,
  getSubjectMetas,
  getSubjectById,
  getChaptersForSubject,
  getChapterById,
  getOverallStats,
  searchQuestions,
} from '../data';

export function useSubjects() {
  const allSubjects = useMemo(() => getAllSubjects(), []);
  const subjectMetas = useMemo(() => getSubjectMetas(), []);
  const stats = useMemo(() => getOverallStats(), []);

  return {
    allSubjects,
    subjectMetas,
    stats,
    getSubject: getSubjectById,
    getChapters: getChaptersForSubject,
    getChapter: getChapterById,
    search: searchQuestions,
  };
}
