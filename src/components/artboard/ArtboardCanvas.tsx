import React, { useCallback, useRef, useState } from 'react';
import { Excalidraw, exportToBlob } from '@excalidraw/excalidraw';
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types';
import '@excalidraw/excalidraw/index.css';
import type { ArtboardDrawing } from '../../types';

export interface ArtboardCanvasProps {
  /** Existing drawing to load (undefined = blank canvas). */
  drawing?: ArtboardDrawing;
  /** Called when the user triggers a save. Receives the current scene state. */
  onSave?: (data: Pick<ArtboardDrawing, 'elements' | 'appState' | 'files'>) => void;
  /** Whether to show a minimal UI (e.g. inside a modal). */
  compact?: boolean;
}

/**
 * Wrapper around the Excalidraw canvas. Handles load/save and provides
 * a ref-based API for programmatic manipulation (AI/MCP integration).
 */
export const ArtboardCanvas: React.FC<ArtboardCanvasProps> = ({
  drawing,
  onSave,
  compact = false,
}) => {
  const excalidrawRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = useCallback(() => {
    setIsDirty(true);
  }, []);

  const handleSave = useCallback(() => {
    const api = excalidrawRef.current;
    if (!api || !onSave) return;

    const elements = api.getSceneElements();
    const appState = api.getAppState();
    const files = api.getFiles();

    onSave({
      elements: elements as unknown as unknown[],
      appState: {
        viewBackgroundColor: appState.viewBackgroundColor,
        currentItemFontFamily: appState.currentItemFontFamily,
        zoom: appState.zoom,
        scrollX: appState.scrollX,
        scrollY: appState.scrollY,
      } as Record<string, unknown>,
      files: files as unknown as Record<string, unknown>,
    });

    setIsDirty(false);
  }, [onSave]);

  /** Generate a PNG thumbnail of the current canvas. */
  const generateThumbnail = useCallback(async (): Promise<string | undefined> => {
    const api = excalidrawRef.current;
    if (!api) return undefined;

    try {
      const blob = await exportToBlob({
        elements: api.getSceneElements(),
        appState: {
          ...api.getAppState(),
          exportWithDarkMode: false,
        },
        files: api.getFiles(),
        getDimensions: () => ({ width: 320, height: 240, scale: 1 }),
      });

      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } catch {
      return undefined;
    }
  }, []);

  // Build initial data from existing drawing
  const initialData = drawing
    ? {
        elements: drawing.elements as any,
        appState: drawing.appState as any,
        files: drawing.files as any,
        scrollToContent: true,
      }
    : undefined;

  return (
    <div className="relative flex flex-col h-full w-full">
      {/* Save button overlay */}
      {onSave && (
        <div className="absolute top-3 right-3 z-50 flex items-center gap-2">
          {isDirty && (
            <span className="text-xs text-amber-500 font-medium">Unsaved changes</span>
          )}
          <button
            onClick={handleSave}
            className="px-3 py-1.5 text-sm font-medium rounded-md bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-hover)] transition-colors duration-150 shadow-sm"
          >
            Save
          </button>
        </div>
      )}

      {/* Excalidraw canvas */}
      <div className="flex-1 min-h-0">
        <Excalidraw
          excalidrawAPI={(api) => {
            excalidrawRef.current = api;
          }}
          initialData={initialData}
          onChange={handleChange}
          UIOptions={{
            canvasActions: {
              loadScene: !compact,
              export: { saveFileToDisk: true },
            },
          }}
        />
      </div>
    </div>
  );
};

// Re-export the thumbnail helper for external use
export { ArtboardCanvas as default };
