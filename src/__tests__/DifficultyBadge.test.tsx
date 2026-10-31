import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { DifficultyBadge } from '../components/common/DifficultyBadge';

describe('DifficultyBadge Component', () => {
  it('renders Easy badge', () => {
    render(<DifficultyBadge difficulty="easy" />);
    expect(screen.getByText('Easy')).toBeInTheDocument();
  });

  it('renders Medium badge', () => {
    render(<DifficultyBadge difficulty="medium" />);
    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  it('renders Hard badge', () => {
    render(<DifficultyBadge difficulty="hard" />);
    expect(screen.getByText('Hard')).toBeInTheDocument();
  });
});
