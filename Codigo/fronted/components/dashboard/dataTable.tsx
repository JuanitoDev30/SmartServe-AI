'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: string;
  header: string;
  className?: string;
  headerClassName?: string;
  render: (item: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  title: string;
  subtitle?: string;
  columns: Column<T>[];
  data: T[];
  footer?: React.ReactNode;
  emptyMessage?: string;
}

export function DataTable<T>({
  title,
  subtitle,
  columns,
  data,
  footer,
  emptyMessage,
}: DataTableProps<T>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm"
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-border bg-gradient-to-r from-muted/50 to-transparent">
        <h3 className="font-semibold text-foreground text-lg">{title}</h3>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {columns.map(col => (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider',
                    col.headerClassName,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  {emptyMessage ?? 'No hay datos disponibles'}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className="group hover:bg-muted/40 transition-colors"
                >
                  {columns.map(col => (
                    <td
                      key={col.key}
                      className={cn('px-4 py-3.5', col.className)}
                    >
                      {col.render(item, index)}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
          {footer && <tfoot>{footer}</tfoot>}
        </table>
      </div>
    </motion.div>
  );
}
