import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Lightbulb,
  Eye,
  EyeOff,
  Hash,
  Copy,
  Check,
} from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { DifficultyBadge } from '../common/DifficultyBadge';
import { MathText } from '../common/MathText';
import { cn } from '../../lib/utils';
import type { Question } from '../../types';

export interface QuestionCardProps {
  question: Question;
  mathTypeName?: string;
  isAnswerOpen: boolean;
  isSolutionOpen: boolean;
  onToggleAnswer: () => void;
  onToggleSolution: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  mathTypeName,
  isAnswerOpen,
  isSolutionOpen,
  onToggleAnswer,
  onToggleSolution,
}) => {
  const [copied, setCopied] = React.useState(false);

  const answerPanelId = `answer-panel-${question.id}`;
  const solutionPanelId = `solution-panel-${question.id}`;

  const handleCopyQuestion = () => {
    navigator.clipboard.writeText(question.question);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card
      className="border border-border shadow-sm hover:border-primary/40 transition-colors"
      role="article"
      aria-labelledby={`question-title-${question.id}`}
    >
      <CardContent className="p-5 sm:p-6 space-y-5">
        {/* Top bar: Question Serial, Math Type, Difficulty, and Copy button */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span
              id={`question-title-${question.id}`}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm shadow-sm"
              aria-label={`Question number ${question.serial}`}
            >
              Q{question.serial}
            </span>
            <DifficultyBadge difficulty={question.difficulty} />
            {mathTypeName && (
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                {mathTypeName}
              </span>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyQuestion}
            className="text-xs text-muted-foreground hover:text-foreground h-8 px-2"
            title="Copy question text"
            aria-label="Copy question text"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span className="hidden sm:inline text-emerald-500">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </Button>
        </div>

        {/* Question Statement */}
        <div className="py-1">
          <MathText className="text-base sm:text-lg font-medium text-foreground">
            {question.question}
          </MathText>
        </div>

        {/* Action Toggles */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-border/60">
          {/* Answer Toggle */}
          <Button
            type="button"
            variant={isAnswerOpen ? 'secondary' : 'outline'}
            size="sm"
            onClick={onToggleAnswer}
            className={cn(
              'transition-all gap-1.5 focus-visible:ring-2 focus-visible:ring-emerald-500',
              isAnswerOpen
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-emerald-400'
            )}
            aria-expanded={isAnswerOpen}
            aria-controls={answerPanelId}
          >
            {isAnswerOpen ? (
              <>
                <EyeOff className="h-4 w-4" aria-hidden="true" />
                <span>Hide Answer</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" aria-hidden="true" />
                <span>Show Answer</span>
              </>
            )}
          </Button>

          {/* Solution Toggle */}
          <Button
            type="button"
            variant={isSolutionOpen ? 'primary' : 'outline'}
            size="sm"
            onClick={onToggleSolution}
            className={cn(
              'transition-all gap-1.5 focus-visible:ring-2 focus-visible:ring-amber-500',
              isSolutionOpen
                ? 'bg-amber-600 text-white hover:bg-amber-700'
                : 'hover:border-amber-500/50 hover:text-amber-600 dark:hover:text-amber-400'
            )}
            aria-expanded={isSolutionOpen}
            aria-controls={solutionPanelId}
          >
            <Lightbulb
              className={cn('h-4 w-4', isSolutionOpen ? 'text-white' : 'text-amber-500')}
              aria-hidden="true"
            />
            <span>{isSolutionOpen ? 'Hide Solution' : 'Show Solution'}</span>
          </Button>
        </div>

        {/* Answer Accordion */}
        <AnimatePresence>
          {isAnswerOpen && (
            <motion.div
              id={answerPanelId}
              role="region"
              aria-label={`Official answer for question ${question.serial}`}
              initial={{ opacity: 0, height: 0, y: -6 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -6 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 p-4 sm:p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>Answer</span>
                </div>
                <div className="text-foreground">
                  <MathText>{question.answer}</MathText>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Solution Accordion */}
        <AnimatePresence>
          {isSolutionOpen && (
            <motion.div
              id={solutionPanelId}
              role="region"
              aria-label={`Step-by-step solution for question ${question.serial}`}
              initial={{ opacity: 0, height: 0, y: -6 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -6 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 p-4 sm:p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  <Lightbulb className="h-4 w-4 shrink-0" />
                  <span>Step-by-Step Solution</span>
                </div>
                <div className="text-foreground text-sm sm:text-base leading-relaxed">
                  <MathText>{question.solution}</MathText>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tags Footer */}
        {question.tags && question.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1" aria-label="Question tags">
            {question.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <Hash className="h-3 w-3 text-muted-foreground/60" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
