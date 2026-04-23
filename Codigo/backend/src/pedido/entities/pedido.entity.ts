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
<<<<<<< HEAD
  @PrimaryGeneratedColumn('uuid')
  id?: string;
  @Column('numeric', {
    default: 0,
  })
  total!: number;
  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
  })
  fecha!: Date;

  @ManyToMany(() => Producto)
  @JoinTable()
  productos: Producto[];
=======
    @PrimaryGeneratedColumn('uuid')
    id!: string;
    @Column('numeric', {
        default: 0,
    })
    total!: number;
    @Column('timestamp', {
        default: () => 'CURRENT_TIMESTAMP',
    })
    fecha!: Date;

    @ManyToMany(() => Producto)
    @JoinTable()
    productos!: Producto[];
    
    @ManyToOne(() => Usuario)
    usuario!: Usuario;
>>>>>>> 2ba5980 (Co-authored-by: MrUrbano753 <MrUrbano753@users.noreply.github.com>)

  @ManyToOne(() => Usuario)
  usuario: Usuario;
}
