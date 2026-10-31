import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { Layout } from '../components/layout/Layout';

describe('Layout component layout and fixed positioning', () => {
  it('renders fixed header at top-0, fixed sidebar at top-16, and content container with pt-16 offset', () => {
    const { container } = render(
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <div data-testid="test-content">Page Content</div>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    );

    // Verify Header is fixed to top
    const header = container.querySelector('header');
    expect(header).not.toBeNull();
    expect(header?.className).toContain('fixed');
    expect(header?.className).toContain('top-0');
    expect(header?.className).toContain('h-16');
    expect(header?.className).toContain('z-40');

    // Verify Sidebar is fixed under the header
    const sidebar = container.querySelector('aside');
    expect(sidebar).not.toBeNull();
    expect(sidebar?.className).toContain('fixed');
    expect(sidebar?.className).toContain('top-16');
    expect(sidebar?.className).toContain('bottom-0');
    expect(sidebar?.className).toContain('z-30');

    // Verify Content wrapper has pt-16 so content is not hidden beneath 64px fixed header
    const content = screen.getByTestId('test-content');
    const mainWrapper = content.closest('main')?.parentElement;
    expect(mainWrapper?.className).toContain('pt-16');
  });
});
