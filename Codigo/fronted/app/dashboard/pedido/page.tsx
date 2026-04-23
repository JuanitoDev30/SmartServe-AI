import { OrdersDashboard } from '@/features/dashboard/Orders/ordersDashboard';
import React from 'react';

export const metadata = {
  title: 'Pedidos - Dashboard',
  descripcion: 'Gestiona y visualiza todos los pedidos',
};

export default function OrderPage() {
  return (
    <div>
      <OrdersDashboard />
    </div>
  );
}
