import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity() 
export class Usuario {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column()
  email: string;

  @Column()
  estado: string;

  @Column()
  rol: string;

  @Column()
  cedula: string;

  @Column({ nullable: true })
  telefono?: string;
}
