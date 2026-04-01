'use client';

import { Search, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="px-3 py-2 bg-card border-b border-border">
      <div className="flex items-center gap-3 rounded-lg bg-muted px-3 py-1.5">
        <button
          className="text-muted-foreground shrink-0 transition-colors"
          aria-label={focused ? 'Volver' : 'Buscar'}
        >
          {focused ? (
            <ArrowLeft className="size-4 text-primary" />
          ) : (
            <Search className="size-4" />
          )}
        </button>
        <input
          type="text"
          placeholder="Buscar o iniciar un nuevo chat"
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />
      </div>
    </div>
  );
}
