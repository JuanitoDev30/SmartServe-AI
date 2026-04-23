import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text', {
    nullable: true,
  })
  nombre?: string;

  @Column('text', {
    nullable: true,
  })
  apellido?: string;

  @Column('text', {
    unique: true,
  })
  email!: string;

  @Column('text', {
    nullable: false,
    default: 'activo',
  })
  estado!: string;

  @Column('text', {
    nullable: false,
  })
  rol!: string;

  @Column('text', {
    unique: true,
    nullable: false,
  })
  cedula!: string;

  @Column('text', {
    nullable: false,
  })
  telefono!: string;
}
