import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReservaService } from './reserva.service';
import { ReservaController } from './reserva.controller';
import { ReservaGateway } from './reserva.gateway';
import { Reserva } from './entities/reserva.entity';
import { MesaModule } from '../mesa/mesa.module';
import { ClienteModule } from '../cliente/cliente.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva]), MesaModule, ClienteModule],
  controllers: [ReservaController],
  providers: [ReservaService, ReservaGateway],
  exports: [ReservaService, ReservaGateway],
})
export class ReservaModule {}
