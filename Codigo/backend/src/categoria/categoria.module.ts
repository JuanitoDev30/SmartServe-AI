import { Module } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CategoriaController } from './categoria.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { Producto } from 'src/producto/entities/producto.entity';

@Module({
  controllers: [CategoriaController],
  providers: [CategoriaService],
  imports: [TypeOrmModule.forFeature([Categoria, Producto])],
})
export class CategoriaModule {}
