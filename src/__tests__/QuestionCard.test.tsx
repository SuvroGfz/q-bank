import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { QuestionCard } from '../components/question/QuestionCard';
import type { Question } from '../types';

describe('QuestionCard Component', () => {
  const mockQuestion: Question = {
    id: 'q-test-1',
    serial: 1,
    question: 'Solve for x: $2x + 4 = 10$',
    answer: '$x = 3$',
    solution: 'Subtract 4 from both sides: $2x = 6$, then divide by 2: $x = 3$',
    difficulty: 'easy',
    tags: ['algebra', 'linear-equations'],
  };

  it('renders question serial, difficulty, and tags', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        isAnswerOpen={false}
        isSolutionOpen={false}
        onToggleAnswer={vi.fn()}
        onToggleSolution={vi.fn()}
      />
    );

    expect(screen.getByText('Q1')).toBeInTheDocument();
    expect(screen.getByText('Easy')).toBeInTheDocument();
    expect(screen.getByText('algebra')).toBeInTheDocument();
    expect(screen.getByText('linear-equations')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show answer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show solution/i })).toBeInTheDocument();
  });

  it('calls onToggleAnswer when answer button is clicked', () => {
    const onToggleAnswer = vi.fn();
    render(
      <QuestionCard
        question={mockQuestion}
        isAnswerOpen={false}
        isSolutionOpen={false}
        onToggleAnswer={onToggleAnswer}
        onToggleSolution={vi.fn()}
      />
    );

    const answerButton = screen.getByRole('button', { name: /show answer/i });
    fireEvent.click(answerButton);
    expect(onToggleAnswer).toHaveBeenCalledTimes(1);
  });

  it('renders answer content when isAnswerOpen is true', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        isAnswerOpen={true}
        isSolutionOpen={false}
        onToggleAnswer={vi.fn()}
        onToggleSolution={vi.fn()}
      />
    );

    expect(screen.getByText('Answer')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /hide answer/i })).toBeInTheDocument();
  });

  it('renders solution content when isSolutionOpen is true', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        isAnswerOpen={false}
        isSolutionOpen={true}
        onToggleAnswer={vi.fn()}
        onToggleSolution={vi.fn()}
      />
    );

    expect(screen.getByText('Step-by-Step Solution')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /hide solution/i })).toBeInTheDocument();
  });
});
