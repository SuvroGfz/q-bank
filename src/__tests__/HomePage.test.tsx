import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';

describe('HomePage Component', () => {
  it('renders question bank heading and statistics', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /question bank/i })).toBeInTheDocument();
    expect(screen.getByText('Total Subjects')).toBeInTheDocument();
    expect(screen.getByText('Curated Chapters')).toBeInTheDocument();
    expect(screen.getByText('Step-by-Step Questions')).toBeInTheDocument();
    expect(screen.getByText('Mathematics')).toBeInTheDocument();
    expect(screen.getByText('Physics')).toBeInTheDocument();
  });
});
