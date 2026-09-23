'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import {
  ImagePlus,
  Link2,
  Loader2,
  RefreshCcw,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { resolveImagenUrl, validarImagen } from '@/lib/utils/imagen';

/** Respuesta de la server action que sube el archivo y devuelve su URL. */
export type SubirImagenAction = (formData: FormData) => Promise<{
  success: boolean;
  data?: { secureUrl: string };
  error?: string;
}>;

interface ImageUploaderProps {
  /** URL ya guardada (o vacío si todavía no hay imagen) */
  value?: string;
  onChange: (url: string | undefined) => void;
  /** Quien use el componente decide a qué endpoint va el archivo */
  onUpload: SubirImagenAction;
  disabled?: boolean;
  className?: string;
}

export function ImageUploader({
  value,
  onChange,
  onUpload,
  disabled,
  className,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [arrastrando, setArrastrando] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modoUrl, setModoUrl] = useState(false);
  const [urlManual, setUrlManual] = useState('');

  const preview = resolveImagenUrl(value);

  const subir = async (file: File) => {
    const problema = validarImagen(file);

    if (problema) {
      setError(problema);
      return;
    }

    setError(null);
    setSubiendo(true);

    const formData = new FormData();
    formData.append('file', file);

    const resultado = await onUpload(formData);

    setSubiendo(false);

    if (!resultado.success || !resultado.data) {
      setError(resultado.error ?? 'No se pudo subir la imagen');
      return;
    }

    onChange(resultado.data.secureUrl);
  };

  const alSoltar = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setArrastrando(false);

    if (disabled || subiendo) return;

    const file = event.dataTransfer.files?.[0];
    if (file) subir(file);
  };

  const aplicarUrlManual = () => {
    const url = urlManual.trim();
    if (!url) return;

    onChange(url);
    setUrlManual('');
    setModoUrl(false);
    setError(null);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {preview ? (
        /* ─── Con imagen: preview + acciones al pasar el cursor ─── */
        <div className="group relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted">
          <Image
            src={preview}
            alt="Imagen del producto"
            fill
            sizes="(max-width: 640px) 100vw, 512px"
            className={cn(
              'object-cover transition-transform duration-300 group-hover:scale-105',
              subiendo && 'blur-sm',
            )}
            // Una URL externa rota no debe romper el formulario
            onError={() => setError('No se pudo cargar la imagen')}
          />

          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-foreground/0 opacity-0 transition-all duration-200 group-hover:bg-foreground/50 group-hover:opacity-100">
            <button
              type="button"
              disabled={disabled || subiendo}
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-card/95 px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-card disabled:opacity-50"
            >
              <RefreshCcw className="size-4" />
              Cambiar
            </button>
            <button
              type="button"
              disabled={disabled || subiendo}
              onClick={() => {
                onChange(undefined);
                setError(null);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-destructive/95 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-destructive disabled:opacity-50"
            >
              <Trash2 className="size-4" />
              Quitar
            </button>
          </div>

          {subiendo && (
            <div className="absolute inset-0 grid place-items-center bg-background/60">
              <Loader2 className="size-6 animate-spin text-primary" />
            </div>
          )}
        </div>
      ) : (
        /* ─── Sin imagen: zona de arrastre ─── */
        <div
          onDragOver={event => {
            event.preventDefault();
            if (!disabled && !subiendo) setArrastrando(true);
          }}
          onDragLeave={() => setArrastrando(false)}
          onDrop={alSoltar}
          onClick={() => !disabled && !subiendo && inputRef.current?.click()}
          className={cn(
            'flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors',
            arrastrando
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-muted/40',
            (disabled || subiendo) && 'cursor-not-allowed opacity-60',
          )}
        >
          {subiendo ? (
            <>
              <Loader2 className="size-7 animate-spin text-primary" />
              <p className="text-sm font-medium text-foreground">
                Subiendo imagen...
              </p>
            </>
          ) : (
            <>
              <span
                className={cn(
                  'grid size-12 place-items-center rounded-full transition-colors',
                  arrastrando
                    ? 'bg-primary/15 text-primary'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {arrastrando ? (
                  <UploadCloud className="size-6" />
                ) : (
                  <ImagePlus className="size-6" />
                )}
              </span>
              <p className="text-sm font-medium text-foreground">
                {arrastrando
                  ? 'Suelta la imagen aquí'
                  : 'Arrastra una imagen o haz clic para buscarla'}
              </p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG, WEBP o AVIF · máximo 3 MB
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={event => {
          const file = event.target.files?.[0];
          if (file) subir(file);
          // Permite volver a elegir el mismo archivo tras quitarlo
          event.target.value = '';
        }}
      />

      {/* Alternativa: pegar una URL externa */}
      {modoUrl ? (
        <div className="flex items-center gap-2">
          <Input
            autoFocus
            value={urlManual}
            onChange={event => setUrlManual(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter') {
                event.preventDefault();
                aplicarUrlManual();
              }
            }}
            placeholder="https://..."
            className="h-9"
          />
          <button
            type="button"
            onClick={aplicarUrlManual}
            className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Usar
          </button>
          <button
            type="button"
            onClick={() => {
              setModoUrl(false);
              setUrlManual('');
            }}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Cancelar"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled || subiendo}
          onClick={() => setModoUrl(true)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary disabled:opacity-50"
        >
          <Link2 className="size-3.5" />
          O pegar la URL de una imagen
        </button>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
