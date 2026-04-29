// pedido-item.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Producto } from '../../producto/entities/producto.entity';
import { Pedido } from './pedido.entity';

@Entity()
export class PedidoItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Pedido, (pedido) => pedido.items, { onDelete: 'CASCADE' })
  pedido!: Pedido;

  @ManyToOne(() => Producto, { eager: true })
  producto!: Producto;

  @Column('int')
  cantidad!: number;

  // Precio snapshot al momento de la compra
  @Column('decimal', { precision: 10, scale: 2 })
  precioUnitario!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotalItem!: number;
}
