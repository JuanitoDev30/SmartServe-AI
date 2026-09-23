import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ZonaMesa } from '../enum/zonaMesa.enum';
import { FormaMesa } from '../enum/formaMesa.enum';
import { Reserva } from 'src/reserva/entities/reserva.entity';

@Entity()
export class Mesa {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column('int', { unique: true })
  numero!: number;

  @Column('int')
  capacidad!: number;

  @Column({ type: 'enum', enum: ZonaMesa, default: ZonaMesa.INTERIOR })
  zona!: ZonaMesa;

  // Una mesa inactiva sigue existiendo (y conserva su historial) pero no
  // se puede reservar: se usa en lugar de borrarla.
  @Index()
  @Column('bool', { default: true })
  activa!: boolean;

  @Column('text', { nullable: true })
  descripcion?: string;

  // ─────────── Plano del salón ───────────
  // Geometría en unidades de grilla (no en píxeles): el frontend decide
  // cuántos píxeles mide una unidad, así el plano escala sin migrar datos.

  @Column({ type: 'enum', enum: FormaMesa, default: FormaMesa.REDONDA })
  forma!: FormaMesa;

  // Centro de la mesa. null = todavía no se ha colocado en el plano; el
  // editor la auto-acomoda por zona hasta que alguien la arrastre.
  @Column('int', { nullable: true })
  posX?: number | null;

  @Column('int', { nullable: true })
  posY?: number | null;

  // null = tamaño derivado de la capacidad
  @Column('int', { nullable: true })
  ancho?: number | null;

  @Column('int', { nullable: true })
  alto?: number | null;

  @Column('int', { default: 0 })
  rotacion!: number;

  @OneToMany(() => Reserva, (reserva) => reserva.mesa)
  reservas!: Reserva[];

  @CreateDateColumn({ type: 'timestamptz' })
  creadoEn!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  actualizadoEn!: Date;
}
