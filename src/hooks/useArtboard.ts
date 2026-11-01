import { useState, useCallback, useMemo } from 'react';
import {
  getAllDrawings,
  getDrawingById,
  createDrawing,
  updateDrawing,
  deleteDrawing,
} from '../data/artboard';
import type { ArtboardDrawing } from '../types';

/**
 * Hook for artboard drawing CRUD — keeps a React-state mirror of the
 * localStorage-backed store, so the UI reacts to mutations.
 */
export function useArtboard() {
  const [drawings, setDrawings] = useState<ArtboardDrawing[]>(() => getAllDrawings());

  const refresh = useCallback(() => {
    setDrawings(getAllDrawings());
  }, []);

  const getById = useCallback(
    (id: string) => getDrawingById(id),
    []
  );

  const create = useCallback(
    (drawing: ArtboardDrawing) => {
      const saved = createDrawing(drawing);
      refresh();
      return saved;
    },
    [refresh]
  );

  const update = useCallback(
    (id: string, patch: Partial<Omit<ArtboardDrawing, 'id' | 'createdAt'>>) => {
      const updated = updateDrawing(id, patch);
      refresh();
      return updated;
    },
    [refresh]
  );

  const remove = useCallback(
    (id: string) => {
      const removed = deleteDrawing(id);
      refresh();
      return removed;
    },
    [refresh]
  );

  const count = useMemo(() => drawings.length, [drawings]);

  return { drawings, count, getById, create, update, remove, refresh };
}
