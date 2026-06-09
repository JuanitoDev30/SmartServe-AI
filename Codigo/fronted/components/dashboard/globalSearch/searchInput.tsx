import { Search, Loader2, X } from 'lucide-react';

interface SearchInputProps {
  query: string;
  isPending: boolean;
  onChange: (value: string) => void;
  onClear: () => void;
  onFocus: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export function SearchInput({
  query,
  isPending,
  onChange,
  onClear,
  onFocus,
  inputRef,
}: SearchInputProps) {
  return (
    <div className="hidden md:flex items-center gap-2 rounded-lg bg-muted px-3 py-2 w-72 border border-transparent focus-within:border-primary/50 focus-within:bg-background transition-all duration-200">
      {isPending ? (
        <Loader2 className="size-4 animate-spin shrink-0 text-muted-foreground" />
      ) : (
        <Search className="size-4 shrink-0 text-muted-foreground" />
      )}

      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={e => onChange(e.target.value)}
        onFocus={onFocus}
        placeholder="Buscar clientes, pedidos, productos..."
        className="w-full bg-transparent text-sm outline-none"
      />

      {query && (
        <button
          type="button"
          onClick={onClear}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
