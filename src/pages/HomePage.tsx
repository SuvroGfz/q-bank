import React from 'react';
import { BookOpen, Layers, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';
import { PageShell, PageHeader } from '../components/ui/PageShell';
import { StatCard } from '../components/ui/StatCard';
import { SubjectGrid } from '../components/subject/SubjectGrid';
import { useSubjects } from '../hooks/useSubjects';

export const HomePage: React.FC = () => {
  const { subjectMetas, stats } = useSubjects();

  return (
    <PageShell>
      {/* Hero / Page Header */}
      <PageHeader
        title="Question Bank"
        subtitle="Explore high-yield academic questions, check answers, and learn through step-by-step math derivations."
        icon={<BookOpen className="h-6 w-6 text-primary" />}
      />

      {/* Stats Cards Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Subjects"
          value={stats.totalSubjects}
          icon={Layers}
          subtext="Mathematics & Physics"
          color="primary"
        />
        <StatCard
          label="Curated Chapters"
          value={stats.totalChapters}
          icon={BookOpen}
          subtext="Covering core syllabus topics"
          color="accent"
        />
        <StatCard
          label="Step-by-Step Questions"
          value={stats.totalQuestions}
          icon={CheckCircle2}
          subtext="With KaTeX LaTeX equations"
          color="secondary"
        />
      </div>

      {/* Subject Cards Grid */}
      <SubjectGrid subjects={subjectMetas} />
    </PageShell>
  );
};
