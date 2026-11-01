import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

export const PageShell: React.FC<PageShellProps> = ({ children, className }) => (
  <div className={cn('mx-auto max-w-5xl w-full px-5 sm:px-8 lg:px-10 py-6 sm:py-8 pb-32 space-y-8', className)}>
    {children}
  </div>
);

/* ─────────────────── Page Header ─────────────────── */

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode; // actions (search, filters, buttons)
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon,
  children,
}) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-border/60">
    <div className="flex items-center gap-3.5">
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20 shrink-0 text-2xl shadow-sm">
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
    {children && <div className="flex flex-wrap items-center gap-3 shrink-0">{children}</div>}
  </div>
);

/* ─────────────────── Section Header ─────────────────── */

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, action }) => (
  <div className="flex items-center justify-between gap-4">
    <div>
      <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground">{title}</h2>
      {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
    {action}
  </div>
);

/* ─────────────────── Search Input ─────────────────── */

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  className,
}) => (
  <div className={cn('relative', className)}>
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full sm:w-64 pl-9 pr-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
    />
  </div>
);
