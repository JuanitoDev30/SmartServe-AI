import { timeFilterLabels } from '@/features/dashboard/shared/constants/timeFilterLabels';
import type { TimeFilter } from '../../features/overView/schemas/types';
import { cn } from '@/lib/utils';

interface TimeFilterTabsProps {
  activeFilter: TimeFilter;
  onFilterChange: (filter: TimeFilter) => void;
}

export function TimeFilterTabs({
  activeFilter,
  onFilterChange,
}: TimeFilterTabsProps) {
  return (
    <div className="inline-flex items-center rounded-lg border border-border bg-muted/50 p-1">
      {(Object.keys(timeFilterLabels) as TimeFilter[]).map(filter => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={cn(
            'px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200',
            activeFilter === filter
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {timeFilterLabels[filter]}
        </button>
      ))}
    </div>
  );
}
