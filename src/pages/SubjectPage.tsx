import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, Layers, HelpCircle, ArrowLeft } from 'lucide-react';
import { PageShell, PageHeader } from '../components/ui/PageShell';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ChapterList } from '../components/chapter/ChapterList';
import { StatCard } from '../components/ui/StatCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { useSubjects } from '../hooks/useSubjects';

export const SubjectPage: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const { getSubject, getChapters } = useSubjects();

  const subject = subjectId ? getSubject(subjectId) : undefined;
  const chapters = subjectId ? getChapters(subjectId) : [];

  if (!subject) {
    return (
      <PageShell>
        <Breadcrumb items={[{ label: 'Subject Not Found' }]} />
        <EmptyState
          icon={HelpCircle}
          title="Subject Not Found"
          description={`We could not locate any subject with the identifier "${subjectId}".`}
          actions={[
            {
              label: 'Return to All Subjects',
              icon: ArrowLeft,
              onClick: () => window.location.assign('/'),
              variant: 'primary',
            },
          ]}
        />
      </PageShell>
    );
  }

  const totalQuestions = chapters.reduce((sum, ch) => sum + ch.questionCount, 0);

  return (
    <PageShell>
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: subject.name }]} />

      {/* Header */}
      <PageHeader
        title={subject.name}
        subtitle={subject.description}
        icon={<span className="text-2xl select-none">{subject.icon}</span>}
      >
        <Link to="/">
          <Button variant="outline" size="sm" className="gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Subjects</span>
          </Button>
        </Link>
      </PageHeader>

      {/* Subject Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          label="Chapters Available"
          value={chapters.length}
          icon={Layers}
          subtext={`Structured learning modules in ${subject.name}`}
          color="primary"
        />
        <StatCard
          label="Practice Questions"
          value={totalQuestions}
          icon={BookOpen}
          subtext="With hidden solutions & derivations"
          color="secondary"
        />
      </div>

      {/* Chapter List */}
      <ChapterList chapters={chapters} subjectName={subject.name} />
    </PageShell>
  );
};
