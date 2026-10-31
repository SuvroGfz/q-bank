import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, ArrowLeft, HelpCircle, FileQuestion } from 'lucide-react';
import { PageShell, PageHeader } from '../components/ui/PageShell';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { QuestionList } from '../components/question/QuestionList';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { useSubjects } from '../hooks/useSubjects';

export const ChapterPage: React.FC = () => {
  const { subjectId, chapterId } = useParams<{ subjectId: string; chapterId: string }>();
  const { getChapter } = useSubjects();

  const data = subjectId && chapterId ? getChapter(subjectId, chapterId) : undefined;

  if (!data) {
    return (
      <PageShell>
        <Breadcrumb
          items={[
            { label: 'Subject', to: `/subjects/${subjectId || ''}` },
            { label: 'Chapter Not Found' },
          ]}
        />
        <EmptyState
          icon={HelpCircle}
          title="Chapter Not Found"
          description={`We could not locate chapter "${chapterId}" in subject "${subjectId}".`}
          actions={[
            {
              label: 'Return to Subject',
              icon: ArrowLeft,
              onClick: () => window.location.assign(`/subjects/${subjectId || ''}`),
              variant: 'primary',
            },
          ]}
        />
      </PageShell>
    );
  }

  const { subject, chapter } = data;

  return (
    <PageShell>
      {/* Breadcrumb navigation */}
      <Breadcrumb
        items={[
          { label: subject.name, to: `/subjects/${subject.id}` },
          { label: chapter.name },
        ]}
      />

      {/* Header */}
      <PageHeader
        title={chapter.name}
        subtitle={chapter.description}
        icon={<span className="text-2xl select-none">{subject.icon}</span>}
      >
        <Link to={`/subjects/${subject.id}`}>
          <Button variant="outline" size="sm" className="gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to {subject.name}</span>
          </Button>
        </Link>
      </PageHeader>

      {/* Serial Question List with Toggles */}
      <QuestionList questions={chapter.questions} chapterName={chapter.name} />
    </PageShell>
  );
};
