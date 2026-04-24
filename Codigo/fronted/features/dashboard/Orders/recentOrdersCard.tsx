'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { Order } from '@/types';
import {
  formatCurrency,
  getOrderStatusColor,
  getOrderStatusLabel,
} from '@/lib/formatCurrency';

const recentOrders: Order[] = [
  {
    id: 'ORD-001',
    customerId: '1',
    customerName: 'Ana Martinez',
    items: [
      {
        id: 'i1',
        name: 'Pizza Margherita',
        quantity: 2,
        unitPrice: 25000,
        totalPrice: 50000,
      },
    ],
    status: 'preparing',
    totalAmount: 60000,
    createdAt: '2024-01-15T14:30:00Z',
    updatedAt: '2024-01-15T14:35:00Z',
  },
  {
    id: 'ORD-002',
    customerId: '2',
    customerName: 'Carlos Rivera',
    items: [
      {
        id: 'i2',
        name: 'Hamburguesa Clasica',
        quantity: 1,
        unitPrice: 22000,
        totalPrice: 22000,
      },
    ],
    status: 'pending',
    totalAmount: 30000,
    createdAt: '2024-01-15T15:00:00Z',
    updatedAt: '2024-01-15T15:00:00Z',
  },
  {
    id: 'ORD-003',
    customerId: '3',
    customerName: 'Laura Gomez',
    items: [
      {
        id: 'i3',
        name: 'Ensalada Cesar',
        quantity: 1,
        unitPrice: 18000,
        totalPrice: 18000,
      },
    ],
    status: 'delivered',
    totalAmount: 25000,
    createdAt: '2024-01-15T12:00:00Z',
    updatedAt: '2024-01-15T13:30:00Z',
  },
  {
    id: 'ORD-004',
    customerId: '4',
    customerName: 'Pedro Sanchez',
    items: [
      {
        id: 'i4',
        name: 'Sushi Roll x12',
        quantity: 2,
        unitPrice: 35000,
        totalPrice: 70000,
      },
    ],
    status: 'confirmed',
    totalAmount: 95000,
    createdAt: '2024-01-15T16:00:00Z',
    updatedAt: '2024-01-15T16:05:00Z',
  },
];

export function RecentOrdersCard() {
  return (
    <div className="rounded-xl bg-card border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Pedidos Recientes
        </h3>
        <Link
          href="/dashboard/orders"
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          Ver todos
          <ArrowRight className="size-4" />
        </Link>
      </div>
      <div className="space-y-4">
        {recentOrders.map(order => (
          <div
            key={order.id}
            className="flex items-center justify-between py-2 border-b border-border last:border-0"
          >
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {order.id}
                </p>
                <p className="text-xs text-muted-foreground">
                  {order.customerName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={cn(
                  'px-2 py-1 rounded-full text-xs font-medium',
                  getOrderStatusColor(order.status),
                )}
              >
                {getOrderStatusLabel(order.status)}
              </span>
              <p className="text-sm font-medium text-foreground w-24 text-right">
                {formatCurrency(order.totalAmount)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
