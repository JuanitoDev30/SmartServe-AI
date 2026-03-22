import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('producto')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post()
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productoService.create(createProductoDto);
  }

  // GET

  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.productoService.findAll(pagination);
  }

  // GET ONE

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productoService.findOne(id);
  }

  // UPDATE

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductoDto,
  ) {
    return this.productoService.update(id, updateProductDto);
  }

  // DELETE

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productoService.remove(id);
  }
}
