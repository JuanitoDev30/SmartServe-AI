'use client';

import { ScrollArea } from '@/components/ui/scrollArea';
import { MessageBubble } from './messageBubble';
import type { Message } from '@/lib/chat-data';
import { useEffect, useRef } from 'react';
import { Lock } from 'lucide-react';

interface MessageAreaProps {
  messages: Message[];
  isTyping?: boolean;
}

export function MessageArea({ messages, isTyping }: MessageAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <ScrollArea className="flex-1 bg-chat-bg">
      <div className="py-4 min-h-full flex flex-col justify-end">
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-1.5 bg-card/80 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm">
            <Lock className="size-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Los mensajes estan cifrados de extremo a extremo
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-0.5">
          {messages.map(message => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {isTyping && (
            <div className="flex justify-start mt-2 px-3">
              <div className="bg-card px-3 py-2 rounded-2xl rounded-bl-sm flex gap-1 shadow-sm">
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-150" />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-300" />
              </div>
            </div>
          )}
        </div>
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
