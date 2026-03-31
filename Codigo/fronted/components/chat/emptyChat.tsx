'use client';

import { MessageSquare, Lock } from 'lucide-react';

export function EmptyChat() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-chat-bg text-center px-8">
      <div className="flex items-center justify-center size-20 rounded-full bg-accent/50 mb-6">
        <MessageSquare className="size-10 text-primary" />
      </div>
      <h2 className="text-2xl font-light text-foreground mb-3 text-balance">
        ChatApp para Escritorio
      </h2>
      <p className="text-sm text-muted-foreground max-w-md leading-relaxed mb-8">
        Envia y recibe mensajes. Selecciona un chat de la lista para comenzar a
        conversar o inicia una nueva conversacion.
      </p>
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Lock className="size-3.5" />
        <span className="text-xs">Cifrado de extremo a extremo</span>
      </div>
    </div>
  );
}
