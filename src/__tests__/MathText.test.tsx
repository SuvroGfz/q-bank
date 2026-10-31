import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { MathText } from '../components/common/MathText';

describe('MathText Component', () => {
  it('renders markdown text correctly', () => {
    const { container } = render(
      <MathText>**Bold text** and *italic text*</MathText>
    );

    const strong = container.querySelector('strong');
    expect(strong).not.toBeNull();
    expect(strong?.textContent).toBe('Bold text');

    const em = container.querySelector('em');
    expect(em).not.toBeNull();
    expect(em?.textContent).toBe('italic text');
  });

  it('renders inline math expressions with KaTeX classes', () => {
    const { container } = render(<MathText>Equation: $x^2 + y^2 = r^2$</MathText>);
    // KaTeX outputs elements with class "katex"
    const katexEl = container.querySelector('.katex');
    expect(katexEl).not.toBeNull();
  });

  it('renders display block math expressions', () => {
    const text = '\n\n$$\\int_{0}^{1} x\\,dx = \\frac{1}{2}$$\n\n';
    const { container } = render(<MathText>{text}</MathText>);
    const katexEl = container.querySelector('.katex');
    expect(katexEl).not.toBeNull();
  });
});
