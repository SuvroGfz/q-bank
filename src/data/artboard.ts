/**
 * In-memory drawing store backed by localStorage.
 *
 * To migrate to Supabase in the future:
 * Replace localStorage reads/writes with Supabase client queries
 * (e.g. supabase.from('drawings').select(...)).
 */

import type { ArtboardDrawing } from '../types';

const STORAGE_KEY = 'qbank_artboard_drawings';

// ── Helpers ───────────────────────────────────────────────────

function loadAll(): ArtboardDrawing[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ArtboardDrawing[]) : [];
  } catch {
    return [];
  }
}

function persist(drawings: ArtboardDrawing[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drawings));
  } catch {
    // storage unavailable or quota exceeded
  }
}

// ── Public API ────────────────────────────────────────────────

/** Returns all saved drawings, newest first. */
export function getAllDrawings(): ArtboardDrawing[] {
  return loadAll().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

/** Retrieves a single drawing by ID. */
export function getDrawingById(id: string): ArtboardDrawing | undefined {
  return loadAll().find((d) => d.id === id);
}

/** Creates a new drawing and persists it. Returns the saved drawing. */
export function createDrawing(drawing: ArtboardDrawing): ArtboardDrawing {
  const all = loadAll();
  all.push(drawing);
  persist(all);
  return drawing;
}

/** Updates an existing drawing. Returns the updated drawing or undefined if not found. */
export function updateDrawing(
  id: string,
  patch: Partial<Omit<ArtboardDrawing, 'id' | 'createdAt'>>
): ArtboardDrawing | undefined {
  const all = loadAll();
  const idx = all.findIndex((d) => d.id === id);
  if (idx === -1) return undefined;

  all[idx] = {
    ...all[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  persist(all);
  return all[idx];
}

/** Deletes a drawing by ID. Returns true if it existed. */
export function deleteDrawing(id: string): boolean {
  const all = loadAll();
  const filtered = all.filter((d) => d.id !== id);
  if (filtered.length === all.length) return false;
  persist(filtered);
  return true;
}
