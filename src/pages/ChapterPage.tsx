import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSubjects } from '../hooks/useSubjects';

export const ChapterPage: React.FC = () => {
  const { subjectId, chapterId } = useParams<{ subjectId: string; chapterId: string }>();
  const { getChapter } = useSubjects();

  const data = subjectId && chapterId ? getChapter(subjectId, chapterId) : undefined;

  if (!data) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-xl font-bold">Chapter not found</h2>
        <Link to="/" className="text-primary hover:underline mt-2 inline-block">
          Return Home
        </Link>
      </div>
    );
  }

  const { subject, chapter } = data;

  return (
    <div className="space-y-4">
      <Link to={`/subjects/${subject.id}`} className="text-sm text-primary hover:underline">
        &larr; Back to {subject.name}
      </Link>
      <h1 className="text-2xl font-bold">{chapter.name}</h1>
      <p className="text-sm text-muted-foreground">{chapter.description}</p>
      <div className="text-sm text-primary font-medium">
        {chapter.questions.length} Questions
      </div>
    </div>
  );
};
