import React from 'react';
import { BookOpen, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-card/40 py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-muted-foreground transition-colors">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-medium text-foreground">
          <BookOpen className="h-4 w-4 text-primary" />
          <span>QBank — Academic Question Bank & Step-by-Step Solutions</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>Engineered with React 19, Tailwind v4 & KaTeX</span>
        </div>
      </div>
    </footer>
  );
};
