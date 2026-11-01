import React from 'react';
import type { ArtboardDrawing } from '../../types';

export interface ArtboardThumbnailProps {
  drawing: ArtboardDrawing;
  onClick?: () => void;
  className?: string;
}

/**
 * Small preview card for a drawing — shows the cached thumbnail
 * or a placeholder icon if none exists yet.
 */
export const ArtboardThumbnail: React.FC<ArtboardThumbnailProps> = ({
  drawing,
  onClick,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-brand)] transition-colors duration-[var(--transition-fast)] ${className}`}
    >
      {drawing.thumbnailDataUrl ? (
        <img
          src={drawing.thumbnailDataUrl}
          alt={drawing.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-[var(--color-bg-tertiary)]">
          {/* Pen-tool icon placeholder */}
          <svg
            className="w-8 h-8 text-[var(--color-text-tertiary)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
            />
          </svg>
        </div>
      )}

      {/* Title overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1.5">
        <span className="text-xs font-medium text-white truncate block">
          {drawing.title}
        </span>
      </div>
    </button>
  );
};
