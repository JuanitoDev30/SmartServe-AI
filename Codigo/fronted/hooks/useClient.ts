// features/clientes/hooks/use-cliente-data.ts

import { getClienteByIdAction } from '@/features/clientes/actions/getClientByIdActions';
import type { ClienteConPedidos } from '@/features/clientes/schemas/clientSchema';
import { useCallback, useEffect, useRef, useState } from 'react';

// Caché en módulo — persiste mientras la página está montada, sin Zustand
const clienteCache = new Map<string, ClienteConPedidos>();

export function useClienteData(clienteId: string | null, isOpen: boolean) {
  const [cliente, setCliente] = useState<ClienteConPedidos | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!isOpen || !clienteId) return;

    // Si ya está en caché, úsalo directo sin fetch
    const cached = clienteCache.get(clienteId);
    if (cached) {
      setCliente(cached);
      return;
    }

    // Cancela cualquier fetch anterior en vuelo
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getClienteByIdAction(clienteId);

        if (abortRef.current?.signal.aborted) return;

        if (result.success && result.data) {
          const data = result.data as ClienteConPedidos;
          clienteCache.set(clienteId, data); // guarda en caché
          setCliente(data);
        } else {
          setError('No se pudo cargar el cliente');
        }
      } catch {
        if (!abortRef.current?.signal.aborted) {
          setError('No se pudo cargar el cliente');
        }
      } finally {
        if (!abortRef.current?.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      abortRef.current?.abort();
    };
  }, [isOpen, clienteId]);

  const reset = useCallback(() => {
    setCliente(null);
    setError(null);
  }, []);

  // Útil cuando actualizas un cliente y necesitas invalidar el caché
  const invalidateCache = useCallback((id?: string) => {
    if (id) {
      clienteCache.delete(id);
    } else {
      clienteCache.clear();
    }
  }, []);

  return { cliente, isLoading, error, reset, invalidateCache };
}
