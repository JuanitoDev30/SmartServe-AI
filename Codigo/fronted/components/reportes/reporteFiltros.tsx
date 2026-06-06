'use client';

import {
  meses,
  type TabReporte,
  tabs,
} from '@/features/dashboard/shared/constants/reporteConstants';
import { Calendar, Download, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ReporteFiltrosProps {
  activeTab: TabReporte;
  fechaInicio: string;
  fechaFin: string;
  mesContable: number;
  anioContable: number;
  isLoading: boolean;
  isDownloading: boolean;
  hasData: boolean;
  onFechaInicioChange: (value: string) => void;
  onFechaFinChange: (value: string) => void;
  onMesContableChange: (value: number) => void;
  onAnioContableChange: (value: number) => void;
  onGenerar: () => void;
  onDescargar: (formato: 'excel') => void;
}

export function ReporteFiltros({
  activeTab,
  fechaInicio,
  fechaFin,
  mesContable,
  anioContable,
  isLoading,
  isDownloading,
  hasData,
  onFechaInicioChange,
  onFechaFinChange,
  onMesContableChange,
  onAnioContableChange,
  onGenerar,
  onDescargar,
}: ReporteFiltrosProps) {
  const currentTab = tabs.find(t => t.value === activeTab);
  const Icon = currentTab?.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        {Icon && (
          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="size-5 text-primary" />
          </div>
        )}
        <div>
          <h3 className="font-semibold text-foreground">Configurar Reporte</h3>
          <p className="text-xs text-muted-foreground">
            {currentTab?.description}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-end">
        <AnimatePresence mode="wait">
          {activeTab !== 'contable' ? (
            <motion.div
              key="date-filters"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex flex-col sm:flex-row gap-4 flex-1"
            >
              <div className="space-y-2 flex-1">
                <label className="text-sm font-medium text-foreground">
                  Fecha Inicio
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={e => onFechaInicioChange(e.target.value)}
                    className={cn(
                      'w-full pl-10 h-11 rounded-xl border border-input bg-background pr-4 text-sm',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary',
                      'transition-all duration-200',
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2 flex-1">
                <label className="text-sm font-medium text-foreground">
                  Fecha Fin
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={e => onFechaFinChange(e.target.value)}
                    className={cn(
                      'w-full pl-10 h-11 rounded-xl border border-input bg-background pr-4 text-sm',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary',
                      'transition-all duration-200',
                    )}
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="contable-filters"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex flex-col sm:flex-row gap-4 flex-1"
            >
              <div className="space-y-2 flex-1">
                <label className="text-sm font-medium text-foreground">
                  Mes
                </label>
                <select
                  value={mesContable}
                  onChange={e => onMesContableChange(parseInt(e.target.value))}
                  className={cn(
                    'w-full h-11 rounded-xl border border-input bg-background px-4 text-sm',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary',
                    'transition-all duration-200',
                  )}
                >
                  {meses.map((m, i) => (
                    <option key={i + 1} value={i + 1}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 flex-1">
                <label className="text-sm font-medium text-foreground">
                  Año
                </label>
                <select
                  value={anioContable}
                  onChange={e => onAnioContableChange(parseInt(e.target.value))}
                  className={cn(
                    'w-full h-11 rounded-xl border border-input bg-background px-4 text-sm',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary',
                    'transition-all duration-200',
                  )}
                >
                  {[2024, 2025, 2026, 2027].map(a => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex gap-3">
          <motion.button
            onClick={onGenerar}
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'inline-flex items-center gap-2.5 rounded-xl bg-primary px-6 h-11 text-sm font-medium text-primary-foreground',
              'hover:bg-primary/90 transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30',
            )}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="size-4 rounded-full border-2 border-primary-foreground border-t-transparent"
              />
            ) : (
              <Sparkles className="size-4" />
            )}
            {isLoading ? 'Generando...' : 'Generar'}
          </motion.button>

          <AnimatePresence>
            {hasData && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => onDescargar('excel')}
                disabled={isDownloading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'inline-flex items-center gap-2.5 rounded-xl border border-border bg-card px-5 h-11 text-sm font-medium text-foreground',
                  'hover:bg-muted transition-all duration-200',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                )}
              >
                <Download className="size-4" />
                {isDownloading ? 'Descargando...' : 'Excel'}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
