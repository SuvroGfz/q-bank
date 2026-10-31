import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { SubjectCard } from '../components/subject/SubjectCard';
import type { SubjectMeta } from '../types';

describe('SubjectCard Component', () => {
  const mockSubject: SubjectMeta = {
    id: 'mathematics',
    name: 'Mathematics',
    description: 'Master core mathematical principles',
    icon: '📐',
    chapterCount: 5,
    questionCount: 15,
  };

  it('renders subject name, description, and counts', () => {
    render(
      <MemoryRouter>
        <SubjectCard subject={mockSubject} />
      </MemoryRouter>
    );

    expect(screen.getByText('Mathematics')).toBeInTheDocument();
    expect(screen.getByText('Master core mathematical principles')).toBeInTheDocument();
    expect(screen.getByText('5 Chapters')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('📐')).toBeInTheDocument();
  });

  it('contains correct link to subject page', () => {
    render(
      <MemoryRouter>
        <SubjectCard subject={mockSubject} />
      </MemoryRouter>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/subjects/mathematics');
  });
});
