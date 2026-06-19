'use client';

import { useRef } from 'react';
import { Upload, FileSpreadsheet, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  file: File | null;
  setFile: (file: File) => void;
  loading: boolean;
  onImport: () => void;
  onClose: () => void;
}

export default function UploadStep({
  file,
  setFile,
  loading,
  onImport,
  onClose,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Importar productos
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Selecciona un archivo Excel (.xlsx, .xls)
          </p>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Zona de upload */}
      <div
        onClick={() => inputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200',
          file
            ? 'border-primary/50 bg-primary/5'
            : 'border-border hover:border-primary/40 hover:bg-muted/30',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={e => {
            if (e.target.files?.[0]) setFile(e.target.files[0]);
          }}
        />

        {file ? (
          <div className="space-y-2">
            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
              <FileSpreadsheet className="size-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024).toFixed(2)} KB — Click para cambiar
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="size-12 rounded-xl bg-muted flex items-center justify-center mx-auto">
              <Upload className="size-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">
              Click para seleccionar archivo
            </p>
            <p className="text-xs text-muted-foreground">
              Formatos soportados: .xlsx, .xls
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
        <button
          onClick={onClose}
          className="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancelar
        </button>
        <button
          disabled={!file || loading}
          onClick={onImport}
          className={cn(
            'inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground',
            'hover:bg-primary/90 transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          )}
        >
          {loading ? (
            <>
              <div className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              Importando...
            </>
          ) : (
            <>
              <Upload className="size-4" />
              Importar
            </>
          )}
        </button>
      </div>
    </div>
  );
}
