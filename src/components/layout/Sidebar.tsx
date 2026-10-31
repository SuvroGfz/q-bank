import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useSubjects } from '../../hooks/useSubjects';

export interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

interface NavItemProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  badge?: number | string;
  isCollapsed: boolean;
  onClick?: () => void;
}

const SidebarNavItem: React.FC<NavItemProps> = ({
  to,
  label,
  icon,
  badge,
  isCollapsed,
  onClick,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const location = useLocation();

  const isExactHome = to === '/' && location.pathname === '/';
  const isSubjectActive = to !== '/' && location.pathname.startsWith(to);
  const isActive = isExactHome || isSubjectActive;

  return (
    <div className="relative">
      <NavLink
        to={to}
        onClick={onClick}
        onMouseEnter={() => isCollapsed && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={cn(
          'group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200',
          isActive
            ? 'bg-primary/10 text-primary border-l-4 border-primary font-semibold'
            : 'text-muted-foreground hover:bg-accent hover:text-foreground border-l-4 border-transparent',
          isCollapsed && 'justify-center px-0'
        )}
      >
        <div
          className={cn(
            'shrink-0 flex items-center justify-center transition-colors duration-200',
            isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
          )}
        >
          {icon}
        </div>

        {!isCollapsed && (
          <div className="flex flex-1 items-center justify-between overflow-hidden">
            <span className="truncate">{label}</span>
            {badge !== undefined && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                {badge}
              </span>
            )}
          </div>
        )}
      </NavLink>

      {/* Tooltip on hover when collapsed */}
      <AnimatePresence>
        {isCollapsed && showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2"
          >
            <div className="rounded-md bg-foreground px-2.5 py-1 text-xs font-medium text-background shadow-lg whitespace-nowrap">
              {label}
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-foreground" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SidebarContent: React.FC<{
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onItemClick: () => void;
  isMobile?: boolean;
}> = ({ isCollapsed, onToggleCollapse, onItemClick, isMobile }) => {
  const { subjectMetas, stats } = useSubjects();

  return (
    <div className="flex h-full flex-col">
      {/* Brand Header */}
      <div
        className={cn(
          'flex items-center border-b border-border px-4 py-4',
          isCollapsed ? 'justify-center' : 'justify-between'
        )}
      >
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#0D9488] to-[#F59E0B] shadow-sm">
              <BookOpen size={16} className="text-white" />
            </div>
            <span className="text-base font-bold tracking-tight bg-gradient-to-r from-[#0D9488] to-[#F59E0B] bg-clip-text text-transparent">
              Question Bank
            </span>
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#0D9488] to-[#F59E0B] shadow-sm">
            <BookOpen size={16} className="text-white" />
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-4 scrollbar-hide">
        <SidebarNavItem
          to="/"
          label="All Subjects"
          icon={<Layers size={18} />}
          badge={stats.totalSubjects}
          isCollapsed={isCollapsed}
          onClick={onItemClick}
        />

        <div className="my-3 mx-2 border-t border-border/80" />

        {!isCollapsed && (
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Subjects
          </p>
        )}

        {subjectMetas.map((s) => (
          <SidebarNavItem
            key={s.id}
            to={`/subjects/${s.id}`}
            label={s.name}
            icon={<span className="text-base select-none">{s.icon}</span>}
            badge={`${s.questionCount}Q`}
            isCollapsed={isCollapsed}
            onClick={onItemClick}
          />
        ))}
      </nav>

      {/* Footer Info / Stats Pill */}
      {!isCollapsed && (
        <div className="p-3 mx-2 mb-2 rounded-xl bg-primary/5 border border-primary/10">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary">
            <GraduationCap size={15} />
            <span>Curated Library</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            {stats.totalQuestions} questions with step-by-step math solutions.
          </p>
        </div>
      )}

      {/* Collapse Toggle Button (Desktop only) */}
      {!isMobile && (
        <div className="border-t border-border p-3">
          <button
            onClick={onToggleCollapse}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg p-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer',
              isCollapsed && 'justify-center p-2'
            )}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            {!isCollapsed && <span className="text-xs font-medium">Collapse Sidebar</span>}
          </button>
        </div>
      )}
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onMobileClose,
}) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'fixed top-16 bottom-0 left-0 z-30 hidden flex-col border-r border-border bg-card lg:flex',
          'transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-16' : 'w-60'
        )}
      >
        <SidebarContent
          isCollapsed={isCollapsed}
          onToggleCollapse={onToggleCollapse}
          onItemClick={() => {}}
        />
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onMobileClose}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Slide-out Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute inset-y-0 left-0 w-64 border-r border-border bg-card shadow-2xl"
            >
              <SidebarContent
                isCollapsed={false}
                onToggleCollapse={onToggleCollapse}
                onItemClick={onMobileClose}
                isMobile
              />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
