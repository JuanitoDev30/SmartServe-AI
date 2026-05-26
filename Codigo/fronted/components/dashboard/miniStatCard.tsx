import { itemVariants } from '@/features/dashboard/shared/constants/timeFilterLabels';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface MiniStatCardProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string | number;
  sublabel?: string;
}

export function MiniStatCard({
  icon,
  iconBg,
  iconColor,
  label,
  value,
  sublabel,
}: MiniStatCardProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="rounded-xl border border-border bg-card p-4 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'size-10 rounded-xl flex items-center justify-center shrink-0',
            iconBg,
          )}
        >
          <div className={iconColor}>{icon}</div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
          <p className="text-xl font-bold text-foreground">{value}</p>
          {sublabel && (
            <p className="text-xs text-muted-foreground">{sublabel}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
