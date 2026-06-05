'use client';

import { useState } from 'react';
import {
  FileText, Users, Package, BookOpen,
  Download, Calendar, ChevronDown,
  TrendingUp, DollarSign, ShoppingBag,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/useToast';
import { formatCurrency } from '@/lib/utils/formatters';

import type {
  ReporteVentas,
  ReporteProductos,
  ReporteClientes,
  ReporteContable,
} from '@/features/reportes/schemas/reportesSchema';
import { getReporteVentasAction } from '@/features/reportes/actions/getReporteVentasAction';
import { getReporteProductosAction } from '@/features/reportes/actions/getReporteProductosAction';
import { getReporteClientesAction } from '@/features/reportes/actions/getReporteClientesAction';
import { getReporteContableAction } from '@/features/reportes/actions/getReporteContableActions';

// ─── TIPOS ───────────────────────────────────────────────────────────────────
type TabReporte = 'ventas' | 'productos' | 'clientes' | 'contable';

const tabs: { value: TabReporte; label: string; icon: React.ReactNode }[] = [
  { value: 'ventas', label: 'Ventas', icon: <TrendingUp className="size-4" /> },
  { value: 'productos', label: 'Productos', icon: <Package className="size-4" /> },
  { value: 'clientes', label: 'Clientes', icon: <Users className="size-4" /> },
  { value: 'contable', label: 'Contable', icon: <BookOpen className="size-4" /> },
];

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const metodoPagoColors: Record<string, string> = {
  EFECTIVO: 'bg-emerald-500/10 text-emerald-600',
  TARJETA: 'bg-blue-500/10 text-blue-600',
  TRANSFERENCIA: 'bg-violet-500/10 text-violet-600',
  PSE: 'bg-orange-500/10 text-orange-600',
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).format(new Date(date));
}

function getPrimerDiaMes() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
}

function getHoy() {
  return new Date().toISOString().split('T')[0];
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
export function ReportesDashboard() {
  const [activeTab, setActiveTab] = useState<TabReporte>('ventas');
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Filtros fecha
  const [fechaInicio, setFechaInicio] = useState(getPrimerDiaMes());
  const [fechaFin, setFechaFin] = useState(getHoy());

  // Filtros contable
  const now = new Date();
  const [mesContable, setMesContable] = useState(now.getMonth() + 1);
  const [anioContable, setAnioContable] = useState(now.getFullYear());

  // Datos
  const [reporteVentas, setReporteVentas] = useState<ReporteVentas | null>(null);
  const [reporteProductos, setReporteProductos] = useState<ReporteProductos | null>(null);
  const [reporteClientes, setReporteClientes] = useState<ReporteClientes | null>(null);
  const [reporteContable, setReporteContable] = useState<ReporteContable | null>(null);

  const handleGenerar = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'ventas') {
        const result = await getReporteVentasAction(fechaInicio, fechaFin);
        if (result.success) setReporteVentas(result.data ?? null);
        else toast({ variant: 'destructive', title: 'Error', description: result.error, duration: 3000 });
      } else if (activeTab === 'productos') {
        const result = await getReporteProductosAction(fechaInicio, fechaFin);
        if (result.success) setReporteProductos(result.data ?? null);
        else toast({ variant: 'destructive', title: 'Error', description: result.error, duration: 3000 });
      } else if (activeTab === 'clientes') {
        const result = await getReporteClientesAction(fechaInicio, fechaFin);
        if (result.success) setReporteClientes(result.data ?? null);
        else toast({ variant: 'destructive', title: 'Error', description: result.error, duration: 3000 });
      } else if (activeTab === 'contable') {
        const result = await getReporteContableAction(mesContable, anioContable);
        if (result.success) setReporteContable(result.data ?? null);
        else toast({ variant: 'destructive', title: 'Error', description: result.error, duration: 3000 });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDescargar = async (formato: 'excel') => {
    setIsDownloading(true);
    try {
      let url = '';
      let filename = '';
      const base = process.env.NEXT_PUBLIC_API_URL;

      if (activeTab === 'ventas') {
        url = `${base}/reportes/ventas?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&formato=${formato}`;
        filename = `reporte-ventas-${fechaInicio}-${fechaFin}.xlsx`;
      } else if (activeTab === 'productos') {
        url = `${base}/reportes/productos?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&formato=${formato}`;
        filename = `reporte-productos-${fechaInicio}-${fechaFin}.xlsx`;
      } else if (activeTab === 'clientes') {
        url = `${base}/reportes/clientes?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&formato=${formato}`;
        filename = `reporte-clientes-${fechaInicio}-${fechaFin}.xlsx`;
      } else if (activeTab === 'contable') {
        url = `${base}/reportes/contable?mes=${mesContable}&anio=${anioContable}&formato=${formato}`;
        filename = `reporte-contable-${meses[mesContable - 1]}-${anioContable}.xlsx`;
      }

      // Fetch con token
      const session = await fetch('/api/auth/session').then(r => r.json());
      const token = session?.accessToken;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);

      toast({ title: 'Descarga iniciada', description: filename, duration: 3000 });
    } catch {
      toast({ variant: 'destructive', title: 'Error al descargar', duration: 3000 });
    } finally {
      setIsDownloading(false);
    }
  };

  const hasData = () => {
    if (activeTab === 'ventas') return !!reporteVentas;
    if (activeTab === 'productos') return !!reporteProductos;
    if (activeTab === 'clientes') return !!reporteClientes;
    if (activeTab === 'contable') return !!reporteContable;
    return false;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Reportes</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Genera y exporta reportes detallados de tu negocio
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 rounded-xl bg-muted p-1 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              activeTab === tab.value
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filtros */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          {activeTab !== 'contable' ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Fecha inicio</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={e => setFechaInicio(e.target.value)}
                    className="pl-9 h-10 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Fecha fin</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={e => setFechaFin(e.target.value)}
                    className="pl-9 h-10 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Mes</label>
                <select
                  value={mesContable}
                  onChange={e => setMesContable(parseInt(e.target.value))}
                  className="h-10 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {meses.map((m, i) => (
                    <option key={i + 1} value={i + 1}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Año</label>
                <select
                  value={anioContable}
                  onChange={e => setAnioContable(parseInt(e.target.value))}
                  className="h-10 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {[2024, 2025, 2026, 2027].map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleGenerar}
              disabled={isLoading}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg bg-primary px-5 h-10 text-sm font-medium text-primary-foreground',
                'hover:bg-primary/90 transition-colors',
                'disabled:opacity-50 disabled:cursor-not-allowed',
              )}
            >
              {isLoading ? (
                <div className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <FileText className="size-4" />
              )}
              {isLoading ? 'Generando...' : 'Generar'}
            </button>

            {hasData() && (
              <button
                onClick={() => handleDescargar('excel')}
                disabled={isDownloading}
                className={cn(
                  'inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 h-10 text-sm font-medium text-foreground',
                  'hover:bg-muted transition-colors',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                )}
              >
                <Download className="size-4" />
                {isDownloading ? 'Descargando...' : 'Excel'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contenido del reporte */}
      {activeTab === 'ventas' && reporteVentas && (
        <ReporteVentasView data={reporteVentas} />
      )}
      {activeTab === 'productos' && reporteProductos && (
        <ReporteProductosView data={reporteProductos} />
      )}
      {activeTab === 'clientes' && reporteClientes && (
        <ReporteClientesView data={reporteClientes} />
      )}
      {activeTab === 'contable' && reporteContable && (
        <ReporteContableView data={reporteContable} />
      )}

      {/* Estado vacío */}
      {!hasData() && !isLoading && (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <FileText className="size-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">
            Selecciona el período y genera el reporte
          </p>
        </div>
      )}
    </div>
  );
}

// ─── VISTA VENTAS ─────────────────────────────────────────────────────────────
function ReporteVentasView({ data }: { data: ReporteVentas }) {
  return (
    <div className="space-y-6">
      {/* Resumen */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Ventas', value: data.totalVentas.toString(), icon: <ShoppingBag className="size-5 text-white" />, bg: 'bg-primary' },
          { label: 'Ingresos Brutos', value: formatCurrency(data.totalBruto), icon: <DollarSign className="size-5 text-white" />, bg: 'bg-emerald-500' },
          { label: 'Total IVA', value: formatCurrency(data.totalIva), icon: <FileText className="size-5 text-white" />, bg: 'bg-orange-500' },
          { label: 'Ingresos Netos', value: formatCurrency(data.totalNeto), icon: <TrendingUp className="size-5 text-white" />, bg: 'bg-blue-500' },
        ].map((card, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className="text-xl font-bold text-foreground mt-1">{card.value}</p>
              </div>
              <div className={cn('rounded-full p-2.5', card.bg)}>{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Detalle de Ventas</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{data.ventas.length} transacciones</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Fecha</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Cliente</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Productos</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Método</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Base</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">IVA</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.ventas.map((v, i) => (
                <tr key={i} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(v.fecha)}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{v.cliente}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground max-w-[200px] truncate">
                    {v.productos.map(p => `${p.nombre} x${p.cantidad}`).join(', ')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', metodoPagoColors[v.metodoPago] ?? 'bg-muted text-muted-foreground')}>
                      {v.metodoPago}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-foreground">{formatCurrency(v.subtotal)}</td>
                  <td className="px-4 py-3 text-sm text-right text-orange-500">{formatCurrency(v.iva)}</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-foreground">{formatCurrency(v.total)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-muted/30 border-t border-border">
                <td colSpan={4} className="px-4 py-3 text-sm font-semibold text-foreground">TOTALES</td>
                <td className="px-4 py-3 text-sm text-right font-semibold text-foreground">{formatCurrency(data.totalNeto)}</td>
                <td className="px-4 py-3 text-sm text-right font-semibold text-orange-500">{formatCurrency(data.totalIva)}</td>
                <td className="px-4 py-3 text-sm text-right font-semibold text-foreground">{formatCurrency(data.totalBruto)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── VISTA PRODUCTOS ──────────────────────────────────────────────────────────
function ReporteProductosView({ data }: { data: ReporteProductos }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Productos Vendidos</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{data.productos.length} productos</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">#</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Producto</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Categoría</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">IVA</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Uds Vendidas</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Pedidos</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Stock</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Ingresos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.productos.map((p, i) => (
              <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 text-sm text-muted-foreground">{i + 1}</td>
                <td className="px-4 py-3 text-sm font-medium text-foreground">{p.nombre}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{p.categoria}</td>
                <td className="px-4 py-3 text-center">
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-full font-medium',
                    p.ivaPercent === 0 ? 'bg-emerald-500/10 text-emerald-600' :
                    p.ivaPercent === 5 ? 'bg-blue-500/10 text-blue-600' :
                    'bg-orange-500/10 text-orange-600',
                  )}>
                    {p.ivaPercent}%
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-center text-foreground">{p.cantidadVendida}</td>
                <td className="px-4 py-3 text-sm text-center text-foreground">{p.pedidos}</td>
                <td className="px-4 py-3 text-center">
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-full font-medium',
                    p.stockActual <= 2 ? 'bg-red-500/10 text-red-500' :
                    p.stockActual <= 5 ? 'bg-orange-500/10 text-orange-500' :
                    'bg-emerald-500/10 text-emerald-600',
                  )}>
                    {p.stockActual} uds
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-right font-semibold text-foreground">
                  {formatCurrency(p.ingresos)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── VISTA CLIENTES ───────────────────────────────────────────────────────────
function ReporteClientesView({ data }: { data: ReporteClientes }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Clientes con Compras</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{data.totalClientes} clientes</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">#</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Cliente</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Teléfono</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Email</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Pedidos</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Ticket Promedio</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Total Gastado</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Última Compra</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.clientes.map((c, i) => (
              <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 text-sm text-muted-foreground">{i + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="size-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
                      {c.nombre.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <span className="text-sm font-medium text-foreground">{c.nombre}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{c.telefono}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{c.email ?? '—'}</td>
                <td className="px-4 py-3 text-sm text-center font-medium text-foreground">{c.totalPedidos}</td>
                <td className="px-4 py-3 text-sm text-right text-foreground">{formatCurrency(c.ticketPromedio)}</td>
                <td className="px-4 py-3 text-sm text-right font-semibold text-foreground">{formatCurrency(c.totalGastado)}</td>
                <td className="px-4 py-3 text-sm text-right text-muted-foreground">{formatDate(c.ultimaCompra)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── VISTA CONTABLE ───────────────────────────────────────────────────────────
function ReporteContableView({ data }: { data: ReporteContable }) {
  return (
    <div className="space-y-6">
      {/* Header contable */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground text-lg">
              Declaración IVA — {data.periodo.mes} {data.periodo.anio}
            </h3>
            <p className="text-sm text-muted-foreground">{data.empresa}</p>
          </div>
          <BookOpen className="size-8 text-muted-foreground/30" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-muted/50 p-4 space-y-1">
            <p className="text-xs text-muted-foreground">Ventas Exentas (0%)</p>
            <p className="text-lg font-bold text-foreground">{formatCurrency(data.resumenIva.baseExenta)}</p>
          </div>
          <div className="rounded-lg bg-blue-500/5 border border-blue-500/20 p-4 space-y-1">
            <p className="text-xs text-muted-foreground">Base Gravable 5%</p>
            <p className="text-lg font-bold text-foreground">{formatCurrency(data.resumenIva.baseGravable5)}</p>
            <p className="text-xs text-blue-600">IVA: {formatCurrency(data.resumenIva.iva5)}</p>
          </div>
          <div className="rounded-lg bg-orange-500/5 border border-orange-500/20 p-4 space-y-1">
            <p className="text-xs text-muted-foreground">Base Gravable 19%</p>
            <p className="text-lg font-bold text-foreground">{formatCurrency(data.resumenIva.baseGravable19)}</p>
            <p className="text-xs text-orange-600">IVA: {formatCurrency(data.resumenIva.iva19)}</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border grid gap-4 sm:grid-cols-3">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Total Ingresos Brutos</p>
            <p className="text-xl font-bold text-foreground">{formatCurrency(data.resumenIva.totalBruto)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Total IVA a Declarar</p>
            <p className="text-xl font-bold text-orange-500">{formatCurrency(data.resumenIva.totalIva)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Base Neta (sin IVA)</p>
            <p className="text-xl font-bold text-emerald-500">{formatCurrency(data.resumenIva.totalBase)}</p>
          </div>
        </div>
      </div>

      {/* Libro de ventas */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Libro de Ventas</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{data.ventas.length} transacciones</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Consec.</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Fecha</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Cliente</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">NIT/Tel</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Descripción</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Método</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Base</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">IVA</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.ventas.map((v, i) => (
                <tr key={i} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{v.consecutivo}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{v.fecha}</td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{v.cliente}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{v.nit}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground max-w-[180px] truncate">{v.descripcion}</td>
                  <td className="px-4 py-3">
                    <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', metodoPagoColors[v.metodoPago] ?? 'bg-muted text-muted-foreground')}>
                      {v.metodoPago}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-foreground">{formatCurrency(v.baseGravable)}</td>
                  <td className="px-4 py-3 text-sm text-right text-orange-500">{formatCurrency(v.iva)}</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-foreground">{formatCurrency(v.total)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-muted/30 border-t border-border">
                <td colSpan={6} className="px-4 py-3 text-sm font-semibold text-foreground">TOTALES</td>
                <td className="px-4 py-3 text-sm text-right font-semibold text-foreground">{formatCurrency(data.resumenIva.totalBase)}</td>
                <td className="px-4 py-3 text-sm text-right font-semibold text-orange-500">{formatCurrency(data.resumenIva.totalIva)}</td>
                <td className="px-4 py-3 text-sm text-right font-semibold text-foreground">{formatCurrency(data.resumenIva.totalBruto)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}