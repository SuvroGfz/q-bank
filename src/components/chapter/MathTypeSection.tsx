import React from 'react';
import { Sparkles, Layers, Check } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { MathText } from '../common/MathText';
import { cn } from '../../lib/utils';
import type { MathTypeCategory, Question } from '../../types';

export interface MathTypeSectionProps {
  mathTypes: MathTypeCategory[];
  questions: Question[];
  selectedTypeId: string | null;
  onSelectType: (typeId: string | null) => void;
}

export const MathTypeSection: React.FC<MathTypeSectionProps> = ({
  mathTypes,
  questions,
  selectedTypeId,
  onSelectType,
}) => {
  if (!mathTypes || mathTypes.length === 0) return null;

  // Calculate question count per math type
  const counts = React.useMemo(() => {
    const map: Record<string, number> = {};
    for (const q of questions) {
      if (q.typeId) {
        map[q.typeId] = (map[q.typeId] || 0) + 1;
      }
    }
    return map;
  }, [questions]);

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Core Concepts & Math Types
          </h2>
        </div>
        {selectedTypeId && (
          <button
            onClick={() => onSelectType(null)}
            className="text-xs text-primary hover:underline font-medium cursor-pointer"
            aria-label="Clear math type filter"
          >
            Show All Math Types
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5" role="group" aria-label="Math Types Filter">
        {mathTypes.map((mt) => {
          const isSelected = selectedTypeId === mt.id;
          const count = counts[mt.id] || 0;

          return (
            <button
              key={mt.id}
              onClick={() => onSelectType(isSelected ? null : mt.id)}
              aria-pressed={isSelected}
              className={cn(
                'text-left rounded-xl border p-4 transition-all duration-200 cursor-pointer relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                isSelected
                  ? 'border-primary bg-primary/10 shadow-sm ring-1 ring-primary/40'
                  : 'border-border bg-card hover:border-primary/40 hover:bg-accent/40 hover:shadow-xs'
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xl shrink-0 select-none">{mt.icon || '📌'}</span>
                  <h3 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                    {mt.name}
                  </h3>
                </div>

                <span
                  className={cn(
                    'text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 border transition-colors',
                    isSelected
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted text-muted-foreground border-border'
                  )}
                >
                  {count} {count === 1 ? 'Q' : 'Qs'}
                </span>
              </div>

              {mt.formula && (
                <div className="mt-2.5 px-2.5 py-1.5 rounded-lg bg-background/80 border border-border/60 text-xs font-mono overflow-x-auto scrollbar-hide">
                  <MathText asInline>{`$${mt.formula}$`}</MathText>
                </div>
              )}

              <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {mt.description}
              </p>

              {isSelected && (
                <div className="absolute top-2 right-2 text-primary">
                  <Check className="h-3.5 w-3.5" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
