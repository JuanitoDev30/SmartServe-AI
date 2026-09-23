'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ImageOff, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { ImagenMensaje } from '@/features/chat/schema/imagenMensaje';

interface ImagenesMensajeProps {
  imagenes: ImagenMensaje[];
}

/**
 * Galería de las fotos que manda el agente dentro de una burbuja: una sola
 * ocupa el ancho, varias se acomodan en cuadrícula, y al tocarlas se abren a
 * pantalla completa.
 */
export function ImagenesMensaje({ imagenes }: ImagenesMensajeProps) {
  const [ampliada, setAmpliada] = useState<ImagenMensaje | null>(null);

  if (imagenes.length === 0) return null;

  const unaSola = imagenes.length === 1;

  return (
    <>
      <div
        className={cn(
          'mt-1 mb-1.5 grid gap-1',
          unaSola ? 'grid-cols-1' : 'grid-cols-2',
        )}
      >
        {imagenes.map((imagen, indice) => (
          <Miniatura
            key={`${imagen.url}-${indice}`}
            imagen={imagen}
            unaSola={unaSola}
            onAmpliar={() => setAmpliada(imagen)}
          />
        ))}
      </div>

      {ampliada && (
        <Lightbox imagen={ampliada} onClose={() => setAmpliada(null)} />
      )}
    </>
  );
}

interface MiniaturaProps {
  imagen: ImagenMensaje;
  unaSola: boolean;
  onAmpliar: () => void;
}

function Miniatura({ imagen, unaSola, onAmpliar }: MiniaturaProps) {
  const [fallo, setFallo] = useState(false);

  if (fallo) {
    return (
      <div className="flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-lg bg-muted text-muted-foreground">
        <ImageOff className="size-5" />
        <span className="text-[10px]">Imagen no disponible</span>
      </div>
    );
  }

  return (
    <figure className="m-0">
      <button
        type="button"
        onClick={onAmpliar}
        className={cn(
          'group relative block w-full overflow-hidden rounded-lg bg-muted',
          unaSola ? 'aspect-[4/3] max-w-[280px]' : 'aspect-square',
        )}
      >
        <Image
          src={imagen.url}
          alt={imagen.descripcion ?? 'Imagen enviada por el asistente'}
          fill
          sizes="280px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setFallo(true)}
        />
      </button>

      {imagen.descripcion && (
        <figcaption className="mt-0.5 text-xs text-muted-foreground">
          {imagen.descripcion}
        </figcaption>
      )}
    </figure>
  );
}

function Lightbox({
  imagen,
  onClose,
}: {
  imagen: ImagenMensaje;
  onClose: () => void;
}) {
  useEffect(() => {
    const alPresionar = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', alPresionar);
    return () => window.removeEventListener('keydown', alPresionar);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-foreground/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-card/90 p-2 text-foreground transition-colors hover:bg-card"
        aria-label="Cerrar imagen"
      >
        <X className="size-5" />
      </button>

      <figure
        className="m-0 flex max-h-full flex-col items-center gap-3"
        onClick={event => event.stopPropagation()}
      >
        {/* Sin next/image: aquí interesa el tamaño real, no una versión recortada */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imagen.url}
          alt={imagen.descripcion ?? 'Imagen enviada por el asistente'}
          className="max-h-[80vh] max-w-full rounded-xl object-contain shadow-2xl"
        />

        {imagen.descripcion && (
          <figcaption className="max-w-lg text-center text-sm text-background dark:text-foreground">
            {imagen.descripcion}
          </figcaption>
        )}
      </figure>
    </div>
  );
}
