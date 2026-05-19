import { Module } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from 'src/pedido/entities/pedido.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido])],
  controllers: [VentasController],
  providers: [VentasService],
})
export class VentasModule {}
