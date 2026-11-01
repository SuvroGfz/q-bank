import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { cn } from '../../lib/utils';

export interface LayoutProps {
  children: React.ReactNode;
}

const SIDEBAR_COLLAPSED_KEY = 'qbank_sidebar_collapsed';

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(isCollapsed));
    } catch {
      // storage unavailable
    }
  }, [isCollapsed]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Header onToggleMobileSidebar={() => setIsMobileOpen(true)} />

      <div className="flex flex-1 pt-16">
        <Sidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
          isMobileOpen={isMobileOpen}
          onMobileClose={() => setIsMobileOpen(false)}
        />

        <main
          className={cn(
            'flex-1 min-h-[calc(100vh-4rem)] transition-all duration-300',
            isCollapsed ? 'lg:ml-16' : 'lg:ml-60'
          )}
        >
          {children}
        </main>
      </div>

      <footer
        className={cn(
          'border-t border-border bg-card/40 py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-muted-foreground transition-all duration-300',
          isCollapsed ? 'lg:ml-16' : 'lg:ml-60'
        )}
      >
        <Footer />
      </footer>
    </div>
  );
};
