import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, BookOpen } from 'lucide-react';
import { ChapterCard } from './ChapterCard';
import { SearchInput, SectionHeader } from '../ui/PageShell';
import { EmptyState } from '../ui/EmptyState';
import type { ChapterMeta } from '../../types';

export interface ChapterListProps {
  chapters: ChapterMeta[];
  subjectName: string;
}

export const ChapterList: React.FC<ChapterListProps> = ({ chapters, subjectName }) => {
  const [search, setSearch] = useState('');

  const filteredChapters = useMemo(() => {
    if (!search.trim()) return chapters;
    const q = search.toLowerCase();
    return chapters.filter(
      (ch) => ch.name.toLowerCase().includes(q) || ch.description.toLowerCase().includes(q)
    );
  }, [chapters, search]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  };

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Chapters"
        subtitle={`Select a chapter to solve questions and view solutions for ${subjectName}`}
        action={
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search chapters..."
            className="w-full sm:w-60"
          />
        }
      />

      {filteredChapters.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {filteredChapters.map((chapter, index) => (
            <motion.div key={chapter.id} variants={itemVariants}>
              <ChapterCard chapter={chapter} index={index} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <EmptyState
          icon={Search}
          title="No chapters found"
          description={`No chapters match your search query "${search}".`}
          actions={[
            {
              label: 'Clear Search',
              onClick: () => setSearch(''),
              variant: 'outline',
            },
          ]}
        />
      )}
    </div>
  );
};
