'use client';

import { useRouter } from 'next/navigation';
import { SearchInput } from './searchInput';
import { useGlobalSearch } from '@/hooks/useGlobalSeach';
import { SearchDropdown } from './searchDropDown';

export function GlobalSearch() {
  const router = useRouter();

  const {
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
  } = useGlobalSearch();

  const handleNavigate = (path: string) => {
    clear();
    setIsOpen(false);
    router.push(path);
  };

  return (
    <div ref={containerRef} className="relative">
      <SearchInput
        query={query}
        isPending={isPending}
        inputRef={inputRef}
        onChange={setQuery}
        onClear={clear}
        onFocus={() => {
          if (results && totalResults > 0) {
            setIsOpen(true);
          }
        }}
      />

      {isOpen && (
        <SearchDropdown
          query={query}
          results={results}
          totalResults={totalResults}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}
