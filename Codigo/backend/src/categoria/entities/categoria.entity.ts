import { Producto } from 'src/producto/entities/producto.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Categoria {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text', {
    unique: true,
  })
  nombre!: string;

  @Column('text', {
    nullable: true,
  })
  imagen?: string;

  @Column('text', {
    nullable: false,
  })
  descripcion?: string;

  @OneToMany(() => Producto, (producto) => producto.categoria)
  productos?: Producto[];
}
