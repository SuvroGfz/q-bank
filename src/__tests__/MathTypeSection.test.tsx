import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MathTypeSection } from '../components/chapter/MathTypeSection';
import type { MathTypeCategory, Question } from '../types';

describe('MathTypeSection Component', () => {
  const mockMathTypes: MathTypeCategory[] = [
    {
      id: 'quadratic',
      name: 'Quadratic Equations',
      description: 'Polynomials with roots',
      formula: 'ax^2 + bx + c = 0',
      icon: '⚡',
    },
    {
      id: 'linear',
      name: 'Linear Equations',
      description: 'First order lines',
      formula: 'y = mx + c',
      icon: '📏',
    },
  ];

  const mockQuestions: Question[] = [
    {
      id: 'q1',
      serial: 1,
      typeId: 'quadratic',
      question: 'Q1',
      answer: 'A1',
      solution: 'S1',
      difficulty: 'easy',
      tags: [],
    },
    {
      id: 'q2',
      serial: 2,
      typeId: 'quadratic',
      question: 'Q2',
      answer: 'A2',
      solution: 'S2',
      difficulty: 'medium',
      tags: [],
    },
  ];

  it('renders all math type categories with counts', () => {
    render(
      <MathTypeSection
        mathTypes={mockMathTypes}
        questions={mockQuestions}
        selectedTypeId={null}
        onSelectType={vi.fn()}
      />
    );

    expect(screen.getByText('Quadratic Equations')).toBeInTheDocument();
    expect(screen.getByText('Linear Equations')).toBeInTheDocument();
    expect(screen.getByText('2 Qs')).toBeInTheDocument();
  });

  it('handles math type selection click', () => {
    const onSelectType = vi.fn();
    render(
      <MathTypeSection
        mathTypes={mockMathTypes}
        questions={mockQuestions}
        selectedTypeId={null}
        onSelectType={onSelectType}
      />
    );

    const quadBtn = screen.getByText('Quadratic Equations');
    fireEvent.click(quadBtn);
    expect(onSelectType).toHaveBeenCalledWith('quadratic');
  });
});
