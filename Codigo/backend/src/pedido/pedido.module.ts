import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';

import { Pedido } from './entities/pedido.entity';
import { PedidoItem } from './entities/pedidoItem.entity';
import { Producto } from '../producto/entities/producto.entity';
import { Cliente } from '../cliente/entities/cliente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido, PedidoItem, Producto, Cliente])],
  controllers: [PedidoController],
  providers: [PedidoService],
  exports: [PedidoService],
})
export class PedidoModule {}
