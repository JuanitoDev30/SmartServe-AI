'use client';

import { useState, useRef, useEffect } from 'react';
import { Smile, Camera, Mic, SendHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  onSend: (text: string) => void;
}

export function MessageInput({ onSend }: MessageInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const hasText = text.trim().length > 0;

  return (
    <div className="flex items-end gap-2 bg-card px-3 py-2 border-t border-border">
      <div className="flex items-center gap-0.5 shrink-0 pb-0.5">
        {/* <button
          className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          aria-label="Emoji"
        >
          <Smile className="size-5" />
        </button> */}
      </div>
      <div className="flex-1 flex items-end bg-muted rounded-2xl px-4 py-2">
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe un mensaje"
          className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none leading-relaxed max-h-[120px]"
        />
      </div>
      <div className="shrink-0 pb-0.5">
        {hasText ? (
          <button
            onClick={handleSend}
            className="rounded-full p-2.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            aria-label="Enviar mensaje"
          >
            <SendHorizontal className="size-5" />
          </button>
        ) : (
          <div className="flex items-center gap-0.5">
            {/* <button
              className="rounded-full p-2.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              aria-label="Nota de voz"
            >
              <Mic className="size-5" />
            </button> */}
            <button
              onClick={handleSend}
              className="rounded-full p-2.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              aria-label="Enviar mensaje"
            >
              <SendHorizontal className="size-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
