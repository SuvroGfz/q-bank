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
 * Pre-processes markdown text to ensure LaTeX math syntax renders with optimal spacing:
 * 1. Automatically converts inline \frac to \dfrac for fractions with radicals or complex terms so they don't overlap.
 * 2. Ensures display math blocks ($$...$$) have blank lines around them for block-level typesetting.
 */
function normalizeMathText(text: string): string {
  if (!text) return '';

  let processed = text;

  // Convert \frac to \dfrac inside math expressions to prevent cramped overlapping in fractions with roots/powers
  processed = processed.replace(/\\frac(?=\{)/g, '\\dfrac');

  // Ensure $$ display math blocks have blank lines before and after so remark-math treats them as block-level.
  // Split by $$ delimiters, then reassemble with guaranteed blank-line separation.
  const parts = processed.split(/(\$\$)/);
  if (parts.length > 1) {
    let insideMath = false;
    const result: string[] = [];
    for (const part of parts) {
      if (part === '$$') {
        if (!insideMath) {
          // Opening $$: ensure blank line before
          const last = result.length > 0 ? result[result.length - 1] : '';
          if (last && !last.endsWith('\n\n')) {
            if (last.endsWith('\n')) {
              result.push('\n');
            } else {
              result.push('\n\n');
            }
          }
          result.push('$$');
        } else {
          // Closing $$: append and ensure blank line after
          result.push('$$');
          result.push('\n\n');
        }
        insideMath = !insideMath;
      } else {
        result.push(part);
      }
    }
    processed = result.join('');
  }

  return processed.trim();
}

/**
 * Renders text with Markdown formatting and KaTeX math support.
 * - Inline math: $x^2 + y^2 = r^2$
 * - Display math: $$\int_{0}^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2}$$
 * - Enhanced with \dfrac upgrades and Tailwind border isolation.
 */
export const MathText: React.FC<MathTextProps> = ({
  children,
  className,
  asInline = false,
}) => {
  const content = React.useMemo(() => normalizeMathText(children), [children]);

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
        rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: false }]]}
        components={
          asInline
            ? {
                p: ({ children: c }) => <span>{c}</span>,
              }
            : undefined
        }
      >
        {content}
      </Markdown>
    </div>
  );
};


