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

@Entity()
export class Pedido {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index() // Consultas frecuentes por usuario
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

  @Column('text')
  direccion!: string;

  @Column('text', { nullable: true })
  notas?: string;

  @Column({ type: 'enum', enum: MetodoPago })
  metodoPago!: MetodoPago;

  @Index() // Consultas frecuentes por estado
  @Column({ type: 'enum', enum: EstadoPedido, default: EstadoPedido.PENDIENTE })
  estado!: EstadoPedido;

  @CreateDateColumn()
  creadoEn!: Date;

  @UpdateDateColumn()
  actualizadoEn!: Date;
}
