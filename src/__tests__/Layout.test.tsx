import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { Layout } from '../components/layout/Layout';

describe('Layout component layout and fixed positioning', () => {
  it('renders fixed header pinned to viewport edges, fixed sidebar at top-16, and content with pt-16 offset', () => {
    const { container } = render(
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <div data-testid="test-content">Page Content</div>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    );

    // Verify Header is fixed to viewport edges (left-0 right-0, NOT w-full)
    const header = container.querySelector('header');
    expect(header).not.toBeNull();
    expect(header?.className).toContain('fixed');
    expect(header?.className).toContain('top-0');
    expect(header?.className).toContain('left-0');
    expect(header?.className).toContain('right-0');
    expect(header?.className).toContain('z-40');
    // Must NOT have w-full — that causes horizontal overflow with scrollbar
    expect(header?.className).not.toContain('w-full');

    // Verify Sidebar is fixed under the header
    const sidebar = container.querySelector('aside');
    expect(sidebar).not.toBeNull();
    expect(sidebar?.className).toContain('fixed');
    expect(sidebar?.className).toContain('top-16');
    expect(sidebar?.className).toContain('bottom-0');
    expect(sidebar?.className).toContain('z-30');

    // Verify content wrapper has pt-16 so content clears the fixed header
    const content = screen.getByTestId('test-content');
    const flexWrapper = content.closest('main')?.parentElement;
    expect(flexWrapper?.className).toContain('pt-16');
  });
});
