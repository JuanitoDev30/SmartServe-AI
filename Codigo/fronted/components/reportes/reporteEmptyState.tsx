'use client';

import { motion } from 'framer-motion';
import { FileText, BarChart3 } from 'lucide-react';

export function ReporteEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-dashed border-border bg-card/50 p-16 text-center"
    >
      <motion.div
        initial={{ y: 10 }}
        animate={{ y: [10, -5, 10] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="relative mx-auto w-fit"
      >
        <div className="absolute inset-0 blur-2xl bg-primary/20 rounded-full" />
        <div className="relative size-20 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center border border-border">
          <FileText className="size-10 text-muted-foreground/50" />
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="absolute -right-2 -top-2 size-8 rounded-lg bg-primary/10 flex items-center justify-center"
        >
          <BarChart3 className="size-4 text-primary" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 space-y-2"
      >
        <h3 className="font-semibold text-foreground">
          Genera tu primer reporte
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Selecciona el período de tiempo y haz clic en &quot;Generar&quot; para
          visualizar los datos
        </p>
      </motion.div>
    </motion.div>
  );
}
