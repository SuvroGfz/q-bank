import React from 'react';
import { cn } from '../../lib/utils';
import type { Difficulty } from '../../types';

export interface DifficultyBadgeProps {
  difficulty: Difficulty;
  className?: string;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty, className }) => {
  const styles: Record<Difficulty, { label: string; classNames: string; dot: string }> = {
    easy: {
      label: 'Easy',
      classNames: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      dot: 'bg-emerald-500',
    },
    medium: {
      label: 'Medium',
      classNames: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      dot: 'bg-amber-500',
    },
    hard: {
      label: 'Hard',
      classNames: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      dot: 'bg-rose-500',
    },
  };

  const current = styles[difficulty] || styles.easy;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border uppercase tracking-wider',
        current.classNames,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', current.dot)} />
      {current.label}
    </span>
  );
};
