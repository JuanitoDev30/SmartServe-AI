// pedido.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { PedidoItem } from './pedidoItem.entity';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { EstadoPedido } from '../enum/pedidoEstado.enum';
import { MetodoPago } from '../enum/metodoPago.enum';
import { TipoEntrega } from '../enum/tipoEntrega.enum';

@Entity()
export class Pedido {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @ManyToOne(() => Cliente, { nullable: false, eager: false })
  cliente!: Cliente;

  @OneToMany(() => PedidoItem, (item) => item.pedido, {
    cascade: true,
    eager: true,
  })
  items!: PedidoItem[];

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  subTotal!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total!: number;

  // DOMICILIO lleva el pedido a una direccion; RECOGER lo deja en el local y
  // no tiene direccion.
  @Column({ type: 'enum', enum: TipoEntrega, default: TipoEntrega.DOMICILIO })
  tipoEntrega!: TipoEntrega;

  @Column('text', { nullable: true })
  direccion?: string | null;

  @Column('text', { nullable: true })
  notas?: string;

  @Column({ type: 'enum', enum: MetodoPago })
  metodoPago!: MetodoPago;

  @Index()
  @Column({ type: 'enum', enum: EstadoPedido, default: EstadoPedido.PENDIENTE })
  estado!: EstadoPedido;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  creadoEn!: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  actualizadoEn!: Date;

  //   // Se setea una sola vez cuando el pedido llega a ENTREGADO
  //   @Index()
  //   @Column({ type: 'timestamptz', nullable: true })
  //   entregadoEn?: Date | null;
}
