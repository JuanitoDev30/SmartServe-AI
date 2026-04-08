import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text', {
    unique: true,
  })
  nombre!: string;

  @Column('numeric', {
    default: 0,
  })
  precio!: number;

  @Column('text', {
    nullable: true,
  })
  descripcion?: string;

  @Column('text', {
    unique: true, //No se van tener 2 slugs iguales / o dos productos iguales
  })
  slug?: string;

  @Column('int', {
    default: 0,
  })
  stock?: number;

  @Column('text', {
    nullable: true,
  })
  imagen?: string;

  @Column('text', {
    nullable: true,
  })
  status?: string;

  @Column('text', {
    nullable: true,
  })
  categoria?: string;
  //Proveedor
  @Column('text', {
    nullable: true,
  })
  proveedor?: string;
}
