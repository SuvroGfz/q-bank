import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Sun, Moon, BookOpen, Sparkles, User as UserIcon, LogIn, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../hooks/useTheme';

export interface HeaderProps {
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, login, logout } = useAuth();

  return (
    <header className="fixed top-0 inset-x-0 z-40 h-16 border-b border-border bg-card/80 backdrop-blur-md transition-colors">
      <div className="max-w-full mx-auto px-4 sm:px-6 flex h-full items-center justify-between">
        {/* Left: Mobile hamburger & Logo */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleMobileSidebar}
            className="lg:hidden text-muted-foreground hover:text-foreground"
            aria-label="Open sidebar navigation"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0D9488] to-[#F59E0B] shadow-md group-hover:scale-105 transition-transform">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-[#0D9488] to-[#F59E0B] bg-clip-text text-transparent">
                QBank
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground -mt-1 hidden sm:inline">
                Question Bank & Solutions
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="text-muted-foreground hover:text-foreground"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
            ) : (
              <Moon className="h-5 w-5 text-slate-700 transition-transform rotate-0 hover:-rotate-12" />
            )}
          </Button>

          {/* Auth Button (Stub for future OAuth) */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs ring-1 ring-primary/20">
                {user.displayName?.[0] || 'U'}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="hidden sm:inline-flex text-xs text-muted-foreground hover:text-destructive gap-1"
                title="Sign out stub"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={login}
              className="text-xs gap-1.5 hidden sm:inline-flex"
              title="Simulate OAuth sign-in"
            >
              <LogIn className="h-3.5 w-3.5 text-primary" />
              <span>Sign In</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
