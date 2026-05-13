import { Module } from '@nestjs/common';
import { AdministradorService } from './administrador.service';
import { AdministradorController } from './administrador.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Administrador } from './entities/administrador.entity';

@Module({
  controllers: [AdministradorController],
  providers: [AdministradorService],
  imports: [TypeOrmModule.forFeature([Administrador])],
  exports: [AdministradorService],
})
export class AdministradorModule {}
