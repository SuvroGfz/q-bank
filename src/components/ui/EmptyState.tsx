import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from './Card';
import { Button } from './Button';

export interface EmptyStateAction {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'amber';
}

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actions?: EmptyStateAction[];
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actions,
  className,
}) => (
  <Card className={`border-2 border-dashed border-border/80 shadow-none bg-card/50 ${className || ''}`}>
    <CardContent className="flex flex-col items-center gap-3 py-14 px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20 text-primary">
        <Icon className="h-7 w-7" />
      </div>
      <div className="max-w-md space-y-1.5 mt-1">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
      {actions && actions.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3 mt-3">
          {actions.map((action) => (
            <Button
              key={action.label}
              size="sm"
              variant={action.variant || 'primary'}
              onClick={action.onClick}
            >
              {action.icon && <action.icon className="h-4 w-4" />}
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);
