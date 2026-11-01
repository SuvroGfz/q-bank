import React from 'react';
import { BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2 font-medium text-foreground">
        <BookOpen className="h-4 w-4 text-primary" />
        <span>QBank — Academic Question Bank & Step-by-Step Solutions</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span>Engineered with React 19, Tailwind v4 & KaTeX</span>
      </div>
    </div>
  );
};
