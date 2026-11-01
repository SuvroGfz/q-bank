import React, { Suspense, useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PenTool, Plus, ArrowLeft, Trash2, Pencil } from 'lucide-react';
import { PageShell, PageHeader, SectionHeader } from '../components/ui/PageShell';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { ArtboardThumbnail } from '../components/artboard/ArtboardThumbnail';
import { useArtboard } from '../hooks/useArtboard';
import type { ArtboardDrawing } from '../types';

// Lazy-load the heavy Excalidraw canvas (~756 kB gzipped).
const ArtboardCanvas = React.lazy(
  () => import('../components/artboard/ArtboardCanvas')
);

type Mode = 'list' | 'edit';

export const ArtboardPage: React.FC = () => {
  const { drawings, create, update, remove, getById } = useArtboard();
  const [searchParams, setSearchParams] = useSearchParams();

  const drawingId = searchParams.get('id');
  const mode: Mode = drawingId ? 'edit' : 'list';

  const activeDrawing = drawingId ? getById(drawingId) : undefined;

  // ── Create ──────────────────────────────────────────────
  const handleCreate = useCallback(() => {
    const now = new Date().toISOString();
    const drawing: ArtboardDrawing = {
      id: crypto.randomUUID(),
      title: `Drawing ${drawings.length + 1}`,
      elements: [],
      createdAt: now,
      updatedAt: now,
    };
    create(drawing);
    setSearchParams({ id: drawing.id });
  }, [create, drawings.length, setSearchParams]);

  // ── Save ────────────────────────────────────────────────
  const handleSave = useCallback(
    (data: Pick<ArtboardDrawing, 'elements' | 'appState' | 'files'>) => {
      if (!drawingId) return;
      update(drawingId, data);
    },
    [drawingId, update]
  );

  // ── Delete ──────────────────────────────────────────────
  const handleDelete = useCallback(
    (id: string) => {
      if (!window.confirm('Delete this drawing? This cannot be undone.')) return;
      remove(id);
      if (drawingId === id) setSearchParams({});
    },
    [remove, drawingId, setSearchParams]
  );

  // ── Back to list ────────────────────────────────────────
  const handleBack = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  // ──────────────────────── Editor Mode ───────────────────
  if (mode === 'edit') {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Thin top bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/60 shrink-0">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleBack} className="gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Drawings</span>
            </Button>
            {activeDrawing && (
              <span className="text-sm font-medium text-foreground truncate max-w-64">
                {activeDrawing.title}
              </span>
            )}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 min-h-0">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Loading editor…
              </div>
            }
          >
            <ArtboardCanvas drawing={activeDrawing} onSave={handleSave} />
          </Suspense>
        </div>
      </div>
    );
  }

  // ──────────────────────── List Mode ─────────────────────
  return (
    <PageShell>
      <PageHeader
        title="Artboard"
        subtitle="Create, edit, and link diagrams to your questions."
        icon={<PenTool className="h-6 w-6 text-primary" />}
      >
        <Button size="sm" onClick={handleCreate} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          <span>New Drawing</span>
        </Button>
      </PageHeader>

      {drawings.length === 0 ? (
        <EmptyState
          icon={Pencil}
          title="No Drawings Yet"
          description="Create your first drawing to get started. Drawings can later be linked to questions."
          actions={[
            {
              label: 'Create Drawing',
              icon: Plus,
              onClick: handleCreate,
              variant: 'primary' as const,
            },
          ]}
        />
      ) : (
        <>
          <SectionHeader
            title={`${drawings.length} Drawing${drawings.length === 1 ? '' : 's'}`}
            subtitle="Click to edit, or link to questions later."
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {drawings.map((d) => (
              <div key={d.id} className="relative group">
                <ArtboardThumbnail
                  drawing={d}
                  onClick={() => setSearchParams({ id: d.id })}
                  className="aspect-[4/3] w-full"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(d.id);
                  }}
                  className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                  title="Delete drawing"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </PageShell>
  );
};
