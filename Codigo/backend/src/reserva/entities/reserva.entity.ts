import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Mesa } from 'src/mesa/entities/mesa.entity';
import { EstadoReserva } from '../enum/reservaEstado.enum';
import { OrigenReserva } from '../enum/origenReserva.enum';

@Entity()
export class Reserva {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @ManyToOne(() => Cliente, { nullable: false, eager: true })
  cliente!: Cliente;

  @Index()
  @ManyToOne(() => Mesa, (mesa) => mesa.reservas, {
    nullable: false,
    eager: true,
  })
  mesa!: Mesa;

  @Index()
  @Column({ type: 'timestamptz' })
  fechaHora!: Date;

  // Franja que ocupa la mesa a partir de fechaHora
  @Column('int', { default: 90 })
  duracionMinutos!: number;

  @Column('int')
  numeroPersonas!: number;

  @Index()
  @Column({
    type: 'enum',
    enum: EstadoReserva,
    default: EstadoReserva.PENDIENTE,
  })
  estado!: EstadoReserva;

  @Column({
    type: 'enum',
    enum: OrigenReserva,
    default: OrigenReserva.DASHBOARD,
  })
  origen!: OrigenReserva;

  @Column('text', { nullable: true })
  notas?: string;

  // Motivo capturado al cancelar, útil para reportes
  @Column('text', { nullable: true })
  motivoCancelacion?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  creadoEn!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  actualizadoEn!: Date;
}
