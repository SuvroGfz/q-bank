import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from './Card';
import { cn } from '../../lib/utils';

export interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  subtext?: string;
  color?: 'primary' | 'secondary' | 'accent' | 'default';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  subtext,
  color = 'primary',
  className,
}) => {
  const iconColors = {
    primary: 'bg-primary/10 text-primary ring-primary/20',
    secondary: 'bg-amber-500/10 text-amber-500 ring-amber-500/20',
    accent: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 ring-teal-500/20',
    default: 'bg-muted text-foreground ring-border',
  };

  return (
    <Card className={cn('relative overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all', className)}>
      <CardContent className="p-5 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{value}</p>
          {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
        </div>
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl ring-1', iconColors[color])}>
          <Icon className="h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  );
};
