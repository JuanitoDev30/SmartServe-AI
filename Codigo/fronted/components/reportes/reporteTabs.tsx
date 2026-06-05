'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  tabs,
  type TabReporte,
} from '@/features/dashboard/shared/constants/reporteConstants';

interface ReporteTabsProps {
  activeTab: TabReporte;
  onTabChange: (tab: TabReporte) => void;
}

export function ReporteTabs({ activeTab, onTabChange }: ReporteTabsProps) {
  return (
    <div className="relative ">
      {/* Dekstop tabs */}

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
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative flex items-center gap-2.5">
                <Icon
                  className={cn(
                    'size-4 transition-colors',
                    isActive && 'text-primary',
                  )}
                />
                <span>{tab.label}</span>
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Mobile dropdown */}

      <div className="sm:hidden">
        <select
          value={activeTab}
          onChange={e => onTabChange(e.target.value as TabReporte)}
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
