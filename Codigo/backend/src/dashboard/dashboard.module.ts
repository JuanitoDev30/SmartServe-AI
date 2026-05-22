import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Pedido } from 'src/pedido/entities/pedido.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Producto } from 'src/producto/entities/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido, Cliente, Producto])],

  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
