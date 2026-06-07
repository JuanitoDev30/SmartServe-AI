'use client';

import { motion } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface TabItem<T extends string> {
  value: T;
  label: string;
  icon?: LucideIcon;
  description?: string;
}

interface TabsSelectorProps<T extends string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  className?: string;
}

export function TabsSelector<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  className,
}: TabsSelectorProps<T>) {
  return (
    <div className={cn('relative', className)}>
      {/* Desktop */}
      <div className="hidden sm:flex items-center gap-1 rounded-2xl bg-muted/50 p-1.5 w-fit backdrop-blur-lg border border-border/50">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.value;

          return (
            <motion.button
              key={tab.value}
              onClick={() => onTabChange(tab.value)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'relative flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-card rounded-xl shadow-sm border border-border/50"
                  transition={{
                    type: 'spring',
                    bounce: 0.2,
                    duration: 0.6,
                  }}
                />
              )}

              <span className="relative flex items-center gap-2.5">
                {Icon && (
                  <Icon
                    className={cn(
                      'size-4 transition-colors',
                      isActive && 'text-primary',
                    )}
                  />
                )}

                <span>{tab.label}</span>
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Mobile */}
      <div className="sm:hidden">
        <select
          value={activeTab}
          onChange={e => onTabChange(e.target.value as T)}
          className="w-full h-12 rounded-xl border-border bg-card px-4 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {tabs.map(tab => (
            <option key={tab.value} value={tab.value}>
              {tab.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
