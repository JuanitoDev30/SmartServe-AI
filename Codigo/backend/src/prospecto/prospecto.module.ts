import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prospecto } from './entities/prospecto.entity';
import { ProspectoService } from './prospecto.service';

@Module({
  imports: [TypeOrmModule.forFeature([Prospecto])],
  providers: [ProspectoService],
  exports: [ProspectoService, TypeOrmModule],
})
export class ProspectoModule {}
