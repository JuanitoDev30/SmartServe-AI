import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proyecto } from './entities/proyecto.entity';
import { ProyectoService } from './proyecto.service';

@Module({
  imports: [TypeOrmModule.forFeature([Proyecto])],
  providers: [ProyectoService],
  exports: [ProyectoService, TypeOrmModule],
})
export class ProyectoModule {}
