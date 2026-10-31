import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  BookOpen,
  ArrowLeft,
  HelpCircle,
  Download,
  FileCode,
  FileText,
  Sparkles,
} from 'lucide-react';
import { PageShell, PageHeader } from '../components/ui/PageShell';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { QuestionList } from '../components/question/QuestionList';
import { MathTypeSection } from '../components/chapter/MathTypeSection';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { useSubjects } from '../hooks/useSubjects';
import { downloadChapterJson, downloadQuestionTemplate } from '../lib/jsonExport';

export const ChapterPage: React.FC = () => {
  const { subjectId, chapterId } = useParams<{ subjectId: string; chapterId: string }>();
  const { getChapter } = useSubjects();

  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

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

  const handleDownloadChapter = () => {
    downloadChapterJson(subject, chapter);
    setDownloadSuccess('Downloaded chapter JSON!');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleDownloadTemplate = () => {
    downloadQuestionTemplate(chapter.name);
    setDownloadSuccess('Downloaded blank question template!');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <PageShell>
      {/* Breadcrumb navigation */}
      <Breadcrumb
        items={[
          { label: subject.name, to: `/subjects/${subject.id}` },
          { label: chapter.name },
        ]}
      />

      {/* Header with Back button & Download Actions */}
      <PageHeader
        title={chapter.name}
        subtitle={chapter.description}
        icon={<span className="text-2xl select-none">{subject.icon}</span>}
      >
        <div className="flex flex-wrap items-center gap-2">
          {/* Download Chapter JSON */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadChapter}
            className="gap-1.5 text-xs"
            title="Download full JSON data for this chapter"
            aria-label="Download chapter questions JSON file"
          >
            <Download className="h-3.5 w-3.5 text-primary" />
            <span>Export JSON</span>
          </Button>

          {/* Download Blank Template */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownloadTemplate}
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            title="Download a clean JSON template to add new questions"
            aria-label="Download question upload JSON template"
          >
            <FileCode className="h-3.5 w-3.5" />
            <span>Sample Template</span>
          </Button>

          <Link to={`/subjects/${subject.id}`}>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to {subject.name}</span>
            </Button>
          </Link>
        </div>
      </PageHeader>

      {/* Download confirmation toast */}
      {downloadSuccess && (
        <div
          role="status"
          className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center justify-between animate-fade-in"
        >
          <span>✅ {downloadSuccess}</span>
        </div>
      )}

      {/* Math Types Categorization Section */}
      {chapter.mathTypes && chapter.mathTypes.length > 0 && (
        <MathTypeSection
          mathTypes={chapter.mathTypes}
          questions={chapter.questions}
          selectedTypeId={selectedTypeId}
          onSelectType={setSelectedTypeId}
        />
      )}

      {/* Serial Question List with Toggles & Filters */}
      <QuestionList
        questions={chapter.questions}
        chapterName={chapter.name}
        mathTypes={chapter.mathTypes || []}
        selectedTypeId={selectedTypeId}
        onClearTypeFilter={() => setSelectedTypeId(null)}
      />
    </PageShell>
  );
};
