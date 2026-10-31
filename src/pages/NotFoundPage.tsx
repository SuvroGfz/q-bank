import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home } from 'lucide-react';
import { PageShell } from '../components/ui/PageShell';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <PageShell className="py-12 sm:py-20">
      <EmptyState
        icon={FileQuestion}
        title="404 — Page Not Found"
        description="The question, chapter, or subject you are looking for does not exist in this library."
        actions={[
          {
            label: 'Back to Question Bank',
            icon: Home,
            onClick: () => window.location.assign('/'),
            variant: 'primary',
          },
        ]}
      />
    </PageShell>
  );
};
