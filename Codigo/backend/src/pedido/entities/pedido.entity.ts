import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { Producto } from '../../producto/entities/producto.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
@Entity()
export class Pedido {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column('numeric', {
    default: 0,
  })
  total!: number;
  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
  })
  fecha?: Date;
  @ManyToMany(() => Producto)
  @JoinTable()
  productos!: Producto[];

  @ManyToOne(() => Usuario)
  usuario!: Usuario;

  @Column('text', {
    nullable: false,
  })
  direccion!: string;

  @Column('text', {
    nullable: true,
  })
  notas?: string;

  @Column('numeric', {
    default: 0,
  })
  subTotal!: number;

  @Column('text', {
    nullable: false,
  })
  metodoPago!: string;

  @Column('text', {
    nullable: false,
  })
  estado!: string;

}
