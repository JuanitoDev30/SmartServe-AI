'use client';

import type { Message } from '@/lib/chat-data';
import { cn } from '@/lib/utils';
import { Check, CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isMe = message.sender === 'me';

  return (
    <div
      className={cn(
        'flex w-full px-4 mb-1',
        isMe ? 'justify-end' : 'justify-start',
      )}
    >
      <div
        className={cn(
          'relative max-w-[75%] rounded-lg px-3 py-1.5 shadow-sm',
          isMe
            ? 'bg-chat-outgoing text-foreground rounded-tr-none'
            : 'bg-chat-incoming text-foreground rounded-tl-none',
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.text}
        </p>
        <div
          className={cn(
            'flex items-center justify-end gap-1 mt-0.5 -mb-0.5',
            'select-none',
          )}
        >
          <span className="text-[10px] text-muted-foreground leading-none">
            {message.timestamp}
          </span>
          {isMe && (
            <span className="text-muted-foreground">
              {message.status === 'read' ? (
                <CheckCheck className="size-3.5 text-sky-500" />
              ) : message.status === 'delivered' ? (
                <CheckCheck className="size-3.5" />
              ) : (
                <Check className="size-3.5" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
