import { Module } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { Producto } from '../producto/entities/producto.entity';
import { Usuario } from '../usuario/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido, Producto, Usuario])],
  controllers: [PedidoController],
  providers: [PedidoService],
})
export class PedidoModule {}
