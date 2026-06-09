export interface SearchRepositoryInterface {
  clientes: {
    id: string;
    nombre: string;
    telefono: string;
    email: string | null;
    estado: string;
    tipo: 'cliente';
  }[];
  pedidos: {
    id: string;
    estado: string;
    total: number;
    cliente: string;
    creadoEn: string;
    tipo: 'pedido';
  }[];
  productos: {
    id: string;
    nombre: string;
    precio: number;
    stock: number;
    status: string;
    tipo: 'producto';
  }[];
}
