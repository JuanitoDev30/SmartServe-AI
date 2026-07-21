import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reunion } from './entities/reunion.entity';
import { ReunionService } from './reunion.service';
import { ProspectoModule } from '../prospecto/prospecto.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reunion]), ProspectoModule],
  providers: [ReunionService],
  exports: [ReunionService, TypeOrmModule],
})
export class ReunionModule {}
