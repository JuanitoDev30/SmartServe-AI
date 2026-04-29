import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EstadoCliente } from '../enum/usuarioEstado.enum';
import { Pedido } from 'src/pedido/entities/pedido.entity';

@Entity()
export class Cliente {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  nombre!: string;

  @Index()
  @Column('text', { unique: true })
  telefono!: string; // identificador principal para el agente

  @Column('text', { unique: true, nullable: true })
  email?: string; // opcional, no hace login

  @Column('text', { nullable: true })
  direccionPrincipal?: string; // pre-rellenar en próximos pedidos

  @Column({ type: 'enum', enum: EstadoCliente, default: EstadoCliente.ACTIVO })
  estado!: EstadoCliente;

  @OneToMany(() => Pedido, (pedido) => pedido.cliente)
  pedidos!: Pedido[];

  @CreateDateColumn()
  creadoEn!: Date;

  @UpdateDateColumn()
  actualizadoEn!: Date;
}
