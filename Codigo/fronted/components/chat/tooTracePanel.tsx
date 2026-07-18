'use client';

import { useEffect, useState } from 'react';
import { X, Wrench, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { chatRepository } from '@/features/chat/services/repositories/chatRepository';

interface ToolTrace {
  tool_name: string;
  input_data: any;
  output_data: any;
  timestamp: string;
}

interface ToolTracePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ToolTracePanel({ isOpen, onClose }: ToolTracePanelProps) {
  const [traces, setTraces] = useState<ToolTrace[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const fetchTraces = async () => {
    setIsLoading(true);
    try {
      const data = await chatRepository.getToolTrace();
      setTraces(data.tool_trace ?? []);
    } catch {
      setTraces([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchTraces();
  }, [isOpen]);

  const toggleExpand = (i: number) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl max-h-[80vh] mx-4 rounded-2xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <Wrench className="size-5 text-primary" />
            <h2 className="font-semibold text-foreground">Tool Trace</h2>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {traces.length} llamadas
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchTraces}
              disabled={isLoading}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors"
              title="Actualizar"
            >
              <RefreshCw
                className={cn('size-4', isLoading && 'animate-spin')}
              />
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : traces.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Wrench className="size-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                No hay herramientas usadas en esta sesión
              </p>
            </div>
          ) : (
            traces.map((trace, i) => (
              <div
                key={i}
                className="rounded-xl border border-border overflow-hidden"
              >
                {/* Trace header */}
                <button
                  onClick={() => toggleExpand(i)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Wrench className="size-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {trace.tool_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {trace.timestamp}
                      </p>
                    </div>
                  </div>
                  {expanded.has(i) ? (
                    <ChevronUp className="size-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="size-4 text-muted-foreground shrink-0" />
                  )}
                </button>

                {/* Trace detail */}
                {expanded.has(i) && (
                  <div className="border-t border-border divide-y divide-border">
                    <div className="px-4 py-3 bg-muted/20">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Input
                      </p>
                      <pre className="text-xs text-foreground font-mono whitespace-pre-wrap break-all">
                        {JSON.stringify(trace.input_data, null, 2)}
                      </pre>
                    </div>
                    <div className="px-4 py-3 bg-muted/10">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Output
                      </p>
                      <pre className="text-xs text-foreground font-mono whitespace-pre-wrap break-all">
                        {JSON.stringify(trace.output_data, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
