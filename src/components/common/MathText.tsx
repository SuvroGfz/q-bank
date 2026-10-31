import React from 'react';
import Markdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { cn } from '../../lib/utils';

export interface MathTextProps {
  children: string;
  className?: string;
  asInline?: boolean;
}

/**
 * Renders text with Markdown formatting and LaTeX math support via KaTeX.
 * - Inline math: $x^2 + y^2 = r^2$
 * - Display math: $$\int_{0}^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2}$$
 * - Full markdown: lists, bold, italics, code blocks, tables.
 */
export const MathText: React.FC<MathTextProps> = ({
  children,
  className,
  asInline = false,
}) => {
  return (
    <div
      className={cn(
        'prose prose-sm dark:prose-invert max-w-none text-foreground leading-relaxed',
        'prose-p:my-2 prose-p:leading-relaxed',
        'prose-headings:font-bold prose-headings:text-foreground',
        'prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs',
        'prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5',
        asInline && 'inline-block prose-p:inline',
        className
      )}
    >
      <Markdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={
          asInline
            ? {
                p: ({ children: c }) => <span>{c}</span>,
              }
            : undefined
        }
      >
        {children}
      </Markdown>
    </div>
  );
};
