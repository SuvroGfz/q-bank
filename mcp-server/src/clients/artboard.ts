/**
 * HTTP client for the Artboard REST API.
 * The MCP server uses this to create/read/update drawings.
 */

const ARTBOARD_BASE = process.env.ARTBOARD_API_URL ?? 'http://localhost:3001';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${ARTBOARD_BASE}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Artboard API error ${res.status}: ${body}`);
  }

  return res.json() as Promise<T>;
}

export interface DrawingMeta {
  id: string;
  title: string;
  elementCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Drawing {
  id: string;
  title: string;
  elements: unknown[];
  appState?: Record<string, unknown>;
  files?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export const artboardClient = {
  listDrawings(): Promise<DrawingMeta[]> {
    return request('/api/drawings');
  },

  getDrawing(id: string): Promise<Drawing> {
    return request(`/api/drawings/${id}`);
  },

  createDrawing(title: string): Promise<Drawing> {
    return request('/api/drawings', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  },

  updateDrawing(id: string, data: Partial<Pick<Drawing, 'title' | 'elements' | 'appState' | 'files'>>): Promise<Drawing> {
    return request(`/api/drawings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  addElements(id: string, elements: unknown[]): Promise<Drawing> {
    return request(`/api/drawings/${id}/elements`, {
      method: 'POST',
      body: JSON.stringify({ elements }),
    });
  },

  deleteDrawing(id: string): Promise<void> {
    return request(`/api/drawings/${id}`, { method: 'DELETE' });
  },

  exportDrawing(id: string, format = 'json'): Promise<unknown> {
    return request(`/api/drawings/${id}/export?format=${format}`);
  },
};
