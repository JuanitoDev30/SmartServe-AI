import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prospecto } from '../prospecto/entities/prospecto.entity';
import { Reunion } from '../reunion/entities/reunion.entity';
import { Proyecto } from '../proyecto/entities/proyecto.entity';
import { AnaliticasService } from './analiticas.service';
import { AnaliticasController } from './analiticas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Prospecto, Reunion, Proyecto])],
  controllers: [AnaliticasController],
  providers: [AnaliticasService],
  exports: [AnaliticasService],
})
export class AnaliticasModule {}
