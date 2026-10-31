import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, FileQuestion } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import type { ChapterMeta } from '../../types';

export interface ChapterCardProps {
  chapter: ChapterMeta;
  index: number;
}

export const ChapterCard: React.FC<ChapterCardProps> = ({ chapter, index }) => {
  return (
    <Link
      to={`/subjects/${chapter.subjectId}/${chapter.id}`}
      className="block group"
    >
      <Card className="hover:border-primary/50 hover:shadow-md transition-all duration-200">
        <CardContent className="p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm ring-1 ring-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              {index + 1}
            </div>

            <div className="min-w-0">
              <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {chapter.name}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 line-clamp-1">
                {chapter.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-muted text-foreground border border-border">
              <FileQuestion className="h-3.5 w-3.5 text-primary" />
              {chapter.questionCount} {chapter.questionCount === 1 ? 'Question' : 'Questions'}
            </span>

            <div className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
              <ChevronRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
