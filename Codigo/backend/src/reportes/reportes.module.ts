import { Module } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { ReportesController } from './reportes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from 'src/pedido/entities/pedido.entity';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Producto } from 'src/producto/entities/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido, Cliente, Producto])],
  controllers: [ReportesController],
  providers: [ReportesService],
})
export class ReportesModule {}
