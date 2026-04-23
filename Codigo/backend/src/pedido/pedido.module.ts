import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';

import { Pedido } from './entities/pedido.entity';
import { Producto } from '../producto/entities/producto.entity';
import { Usuario } from '../usuario/entities/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Pedido,
      Producto,
      Usuario,
    ]),
  ],
  controllers: [PedidoController],
  providers: [PedidoService],
  exports: [PedidoService], 
})
export class PedidoModule {}




