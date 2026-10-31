import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Layers } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import type { SubjectMeta } from '../../types';

export interface SubjectCardProps {
  subject: SubjectMeta;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject }) => {
  return (
    <Link to={`/subjects/${subject.id}`} className="block group h-full">
      <Card className="h-full flex flex-col justify-between hover:shadow-lg hover:border-primary/50 hover:-translate-y-1 transition-all duration-300">
        <CardContent className="p-6 space-y-4 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/15 text-3xl ring-1 ring-primary/20 shadow-sm group-hover:scale-105 transition-transform">
              {subject.icon}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              <Layers className="h-3 w-3" />
              <span>{subject.chapterCount} Chapters</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
              {subject.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {subject.description}
            </p>
          </div>
        </CardContent>

        <div className="px-6 py-4 border-t border-border/70 bg-muted/20 flex items-center justify-between text-xs font-medium text-muted-foreground rounded-b-xl">
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            <strong className="text-foreground">{subject.questionCount}</strong> Questions Total
          </span>
          <span className="inline-flex items-center gap-1 text-primary font-semibold group-hover:translate-x-0.5 transition-transform">
            Explore
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </Card>
    </Link>
  );
};
