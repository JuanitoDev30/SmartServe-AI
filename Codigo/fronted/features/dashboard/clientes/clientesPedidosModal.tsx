'use client';
import { useState, useEffect } from 'react';
import {
  X,
  ShoppingBag,
  DollarSign,
  Package,
  ChevronDown,
  ChevronUp,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  type Cliente,
  type EstadoCliente,
} from '@/features/clientes/schemas/clientSchema';
import { getClienteByIdAction } from '@/features/clientes/actions/getClientByIdActions';

interface ClientePedidosModalProps {
  isOpen: boolean;
  onClose: () => void;
  clienteId: string | null;
}

const pedidoEstadoConfig: Record<string, { label: string; color: string }> = {
  PENDIENTE: { label: 'Pendiente', color: 'bg-orange-500' },
  CONFIRMADO: { label: 'Confirmado', color: 'bg-blue-500' },
  EN_PREPARACION: { label: 'En Preparación', color: 'bg-blue-500' },
  EN_CAMINO: { label: 'En Camino', color: 'bg-cyan-500' },
  ENTREGADO: { label: 'Entregado', color: 'bg-emerald-500' },
  CANCELADO: { label: 'Cancelado', color: 'bg-red-500' },
};

const estadoFiltros = [
  { label: 'Todos', value: 'todos' },
  { label: 'Pendiente', value: 'PENDIENTE' },
  { label: 'Confirmado', value: 'CONFIRMADO' },
  { label: 'En Preparación', value: 'EN_PREPARACION' },
  { label: 'En Camino', value: 'EN_CAMINO' },
  { label: 'Entregado', value: 'ENTREGADO' },
  { label: 'Cancelado', value: 'CANCELADO' },
];

function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value);
}
