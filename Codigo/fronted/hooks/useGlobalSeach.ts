import { useEffect, useMemo, useRef, useState, useTransition } from 'react';

import { useDebounce } from './useDebounce';
import { SearchRepositoryInterface } from '@/features/search/services/repositories/searchRepositoryInterface';
import { searchAction } from '@/features/search/actions/searchActions';

export function useGlobalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchRepositoryInterface | null>(
    null,
  );

  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 350);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const search = debouncedQuery.trim();

    if (search.length < 2) {
      setResults(null);
      setIsOpen(false);
      return;
    }

    startTransition(async () => {
      const result = await searchAction(search);

      if (result.success && result.data) {
        setResults(result.data);
        setIsOpen(true);
      }
    });
  }, [debouncedQuery]);

  const totalResults = useMemo(() => {
    if (!results) return 0;

    return (
      results.clientes.length +
      results.pedidos.length +
      results.productos.length
    );
  }, [results]);

  const clear = () => {
    setQuery('');
    setResults(null);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return {
    query,
    setQuery,

    results,
    totalResults,

    isOpen,
    setIsOpen,

    isPending,

    clear,

    inputRef,
    containerRef,
  };
}
