import React from 'react';
import { Link } from 'react-router-dom';
import { useSubjects } from '../hooks/useSubjects';

export const HomePage: React.FC = () => {
  const { subjectMetas, stats } = useSubjects();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Home — Subjects ({stats.totalSubjects})</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {subjectMetas.map((s) => (
          <Link
            key={s.id}
            to={`/subjects/${s.id}`}
            className="p-4 border rounded-xl bg-card hover:border-primary transition-colors block"
          >
            <span className="text-2xl mr-2">{s.icon}</span>
            <span className="font-semibold">{s.name}</span>
            <p className="text-sm text-muted-foreground mt-1">{s.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
