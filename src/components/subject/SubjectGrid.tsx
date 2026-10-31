import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Search } from 'lucide-react';
import { SubjectCard } from './SubjectCard';
import { SearchInput, SectionHeader } from '../ui/PageShell';
import { EmptyState } from '../ui/EmptyState';
import type { SubjectMeta } from '../../types';

export interface SubjectGridProps {
  subjects: SubjectMeta[];
}

export const SubjectGrid: React.FC<SubjectGridProps> = ({ subjects }) => {
  const [search, setSearch] = useState('');

  const filteredSubjects = useMemo(() => {
    if (!search.trim()) return subjects;
    const q = search.toLowerCase();
    return subjects.filter(
      (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    );
  }, [subjects, search]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Academic Subjects"
        subtitle="Select a subject to explore curated chapters and structured questions"
        action={
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search subjects..."
            className="w-full sm:w-60"
          />
        }
      />

      {filteredSubjects.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5"
        >
          {filteredSubjects.map((subject) => (
            <motion.div key={subject.id} variants={itemVariants}>
              <SubjectCard subject={subject} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <EmptyState
          icon={Search}
          title="No subjects found"
          description={`We couldn't find any subjects matching "${search}". Try searching for another subject or clear the search query.`}
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
