import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Administrador {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  nombre!: string;

  @Column({ nullable: true })
  telefono?: string;

  @Column({ default: true })
  activo?: boolean;

  @CreateDateColumn()
  creadoEn?: Date;

  @UpdateDateColumn()
  actualizadoEn?: Date;
}
