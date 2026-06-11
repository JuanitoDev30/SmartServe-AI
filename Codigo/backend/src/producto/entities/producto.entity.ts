import { Categoria } from 'src/categoria/entities/categoria.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  nombre!: string;

  @Column('float', {
    default: 0,
  })
  precio!: number;

  @Column('text', {
    nullable: true,
  })
  descripcion?: string;

  @Column('text', { nullable: true })
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

  @ManyToOne(() => Categoria, (categoria) => categoria.productos, {
    eager: true,
  })
  categoria?: Categoria;
  //Proveedor
  @Column('text', {
    nullable: true,
  })
  proveedor?: string;

  @Column('float', { default: 19 })
  ivaPercent!: number;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
