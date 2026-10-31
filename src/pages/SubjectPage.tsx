import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSubjects } from '../hooks/useSubjects';

export const SubjectPage: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const { getSubject, getChapters } = useSubjects();

  const subject = subjectId ? getSubject(subjectId) : undefined;
  const chapters = subjectId ? getChapters(subjectId) : [];

  if (!subject) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-xl font-bold">Subject not found</h2>
        <Link to="/" className="text-primary hover:underline mt-2 inline-block">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{subject.icon}</span>
        <div>
          <h1 className="text-2xl font-bold">{subject.name}</h1>
          <p className="text-sm text-muted-foreground">{subject.description}</p>
        </div>
      </div>
      <div className="space-y-3">
        {chapters.map((ch) => (
          <Link
            key={ch.id}
            to={`/subjects/${subject.id}/${ch.id}`}
            className="p-4 border rounded-xl bg-card hover:border-primary transition-colors block"
          >
            <h3 className="font-semibold">{ch.name}</h3>
            <p className="text-sm text-muted-foreground">{ch.description}</p>
            <span className="text-xs text-primary font-medium mt-2 inline-block">
              {ch.questionCount} Questions
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};
