import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Eye,
  EyeOff,
  Lightbulb,
  Search,
  Filter,
  CheckCheck,
  RotateCcw,
} from 'lucide-react';
import { QuestionCard } from './QuestionCard';
import { Button } from '../ui/Button';
import { SearchInput } from '../ui/PageShell';
import { EmptyState } from '../ui/EmptyState';
import type { Question, Difficulty, MathTypeCategory } from '../../types';

export interface QuestionListProps {
  questions: Question[];
  chapterName: string;
  mathTypes?: MathTypeCategory[];
  selectedTypeId?: string | null;
  onClearTypeFilter?: () => void;
}

export const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  chapterName,
  mathTypes = [],
  selectedTypeId,
  onClearTypeFilter,
}) => {
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'all'>('all');

  // Individual toggle states: mapping question ID to boolean
  const [answersOpen, setAnswersOpen] = useState<Record<string, boolean>>({});
  const [solutionsOpen, setSolutionsOpen] = useState<Record<string, boolean>>({});

  // Lookup math type name by typeId
  const mathTypeMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const mt of mathTypes) {
      map[mt.id] = mt.name;
    }
    return map;
  }, [mathTypes]);

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      // Math type category filter
      if (selectedTypeId && q.typeId !== selectedTypeId) {
        return false;
      }

      const matchesDifficulty =
        difficultyFilter === 'all' || q.difficulty === difficultyFilter;

      if (!matchesDifficulty) return false;

      if (!search.trim()) return true;
      const term = search.toLowerCase();
      const matchesQuestion = q.question.toLowerCase().includes(term);
      const matchesAnswer = q.answer.toLowerCase().includes(term);
      const matchesSolution = q.solution.toLowerCase().includes(term);
      const matchesTags = q.tags.some((t) => t.toLowerCase().includes(term));

      return matchesQuestion || matchesAnswer || matchesSolution || matchesTags;
    });
  }, [questions, search, difficultyFilter, selectedTypeId]);

  // Bulk toggle calculations
  const allAnswersCurrentlyOpen = useMemo(() => {
    if (filteredQuestions.length === 0) return false;
    return filteredQuestions.every((q) => answersOpen[q.id]);
  }, [filteredQuestions, answersOpen]);

  const allSolutionsCurrentlyOpen = useMemo(() => {
    if (filteredQuestions.length === 0) return false;
    return filteredQuestions.every((q) => solutionsOpen[q.id]);
  }, [filteredQuestions, solutionsOpen]);

  const toggleAllAnswers = () => {
    const nextState = !allAnswersCurrentlyOpen;
    const updated = { ...answersOpen };
    for (const q of filteredQuestions) {
      updated[q.id] = nextState;
    }
    setAnswersOpen(updated);
  };

  const toggleAllSolutions = () => {
    const nextState = !allSolutionsCurrentlyOpen;
    const updated = { ...solutionsOpen };
    for (const q of filteredQuestions) {
      updated[q.id] = nextState;
    }
    setSolutionsOpen(updated);
  };

  const toggleSingleAnswer = (id: string) => {
    setAnswersOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSingleSolution = (id: string) => {
    setSolutionsOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const resetFilters = () => {
    setSearch('');
    setDifficultyFilter('all');
    if (onClearTypeFilter) onClearTypeFilter();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar: Search, Difficulty Filters & Bulk Toggles */}
      <div className="flex flex-col gap-4 p-4 rounded-xl border border-border bg-card/60 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search within this chapter..."
            className="w-full sm:w-72"
          />

          {/* Bulk Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAllAnswers}
              className="text-xs gap-1.5"
              title={allAnswersCurrentlyOpen ? 'Hide all answers' : 'Show all answers'}
            >
              {allAnswersCurrentlyOpen ? (
                <>
                  <EyeOff className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Hide All Answers</span>
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Show All Answers</span>
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={toggleAllSolutions}
              className="text-xs gap-1.5"
              title={allSolutionsCurrentlyOpen ? 'Hide all solutions' : 'Show all solutions'}
            >
              <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
              <span>{allSolutionsCurrentlyOpen ? 'Hide All Solutions' : 'Show All Solutions'}</span>
            </Button>
          </div>
        </div>

        {/* Difficulty Filter Chips & Counter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/60">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-medium text-muted-foreground mr-1 flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" />
              Difficulty:
            </span>
            {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficultyFilter(diff)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  difficultyFilter === diff
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {diff === 'all' ? 'All' : diff.charAt(0).toUpperCase() + diff.slice(1)}
              </button>
            ))}
          </div>

          <div className="text-xs text-muted-foreground">
            Showing <strong className="text-foreground">{filteredQuestions.length}</strong> of{' '}
            <strong className="text-foreground">{questions.length}</strong> questions
          </div>
        </div>
      </div>

      {/* Questions Serial List */}
      {filteredQuestions.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-5"
        >
          {filteredQuestions.map((q) => (
            <motion.div key={q.id} variants={itemVariants}>
              <QuestionCard
                question={q}
                mathTypeName={q.typeId ? mathTypeMap[q.typeId] : undefined}
                isAnswerOpen={!!answersOpen[q.id]}
                isSolutionOpen={!!solutionsOpen[q.id]}
                onToggleAnswer={() => toggleSingleAnswer(q.id)}
                onToggleSolution={() => toggleSingleSolution(q.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <EmptyState
          icon={Search}
          title="No questions match your criteria"
          description={`No questions in ${chapterName} match your search "${search}" with difficulty "${difficultyFilter}".`}
          actions={[
            {
              label: 'Reset Filters',
              icon: RotateCcw,
              onClick: resetFilters,
              variant: 'outline',
            },
          ]}
        />
      )}
    </div>
  );
};
