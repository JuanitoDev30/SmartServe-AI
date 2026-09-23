'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Package } from 'lucide-react';

import { cn } from '@/lib/utils';
import { resolveImagenUrl } from '@/lib/utils/imagen';

interface ProductoImagenProps {
  imagen?: string | null;
  nombre: string;
  /** Tamaño y forma los pone quien la usa (tarjeta, tabla, chat) */
  className?: string;
  sizes?: string;
  iconClassName?: string;
}

/**
 * Imagen de un producto con su respaldo: si no hay URL, o si la externa está
 * rota, cae en un marcador con la inicial del producto en vez de un hueco.
 */
export function ProductoImagen({
  imagen,
  nombre,
  className,
  sizes = '96px',
  iconClassName,
}: ProductoImagenProps) {
  const [fallo, setFallo] = useState(false);
  const url = resolveImagenUrl(imagen);

  return (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden bg-muted',
        className,
      )}
    >
      {url && !fallo ? (
        <Image
          src={url}
          alt={nombre}
          fill
          sizes={sizes}
          className="object-cover"
          onError={() => setFallo(true)}
        />
      ) : (
        <div className="grid size-full place-items-center bg-gradient-to-br from-primary/10 to-primary/5 text-primary">
          <Package className={cn('size-1/3 min-w-4 opacity-70', iconClassName)} />
        </div>
      )}
    </div>
  );
}
