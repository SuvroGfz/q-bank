export type Difficulty = 'easy' | 'medium' | 'hard';

export interface MathTypeCategory {
  id: string;
  name: string;
  description: string;
  formula?: string;
  icon?: string;
}

export interface Question {
  id: string;
  serial: number;
  question: string;
  answer: string;
  solution: string;
  difficulty: Difficulty;
  typeId?: string; // References MathTypeCategory.id
  tags: string[];
  /** IDs of linked artboard drawings */
  drawingIds?: string[];
}

export interface Chapter {
  id: string;
  name: string;
  description: string;
  mathTypes?: MathTypeCategory[];
  questions: Question[];
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  chapters: Chapter[];
}

export interface SubjectMeta {
  id: string;
  name: string;
  description: string;
  icon: string;
  chapterCount: number;
  questionCount: number;
}

export interface ChapterMeta {
  id: string;
  subjectId: string;
  name: string;
  description: string;
  questionCount: number;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export type Theme = 'light' | 'dark';

// ── Artboard / Drawing ───────────────────────────────────────

export interface ArtboardDrawing {
  id: string;
  /** Human-readable label for the drawing */
  title: string;
  /** Excalidraw scene elements (serialized JSON) */
  elements: unknown[];
  /** Excalidraw app state subset (background, zoom, scroll) */
  appState?: Record<string, unknown>;
  /** Excalidraw files (embedded images / assets) */
  files?: Record<string, unknown>;
  /** Base64 PNG thumbnail for list previews */
  thumbnailDataUrl?: string;
  createdAt: string;
  updatedAt: string;
}
