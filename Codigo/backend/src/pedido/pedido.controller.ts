import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';

@Controller('pedido')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  //  CREATE
  @Post()
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidoService.create(createPedidoDto);
  }

  //  GET ALL
  @Get()
  findAll() {
    return this.pedidoService.findAll();
  }

  //  GET ONE
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.pedidoService.findOne(id);
  }

  //  UPDATE
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePedidoDto: UpdatePedidoDto,
  ) {
    return this.pedidoService.update(id, updatePedidoDto);
  }

  // DELETE
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.pedidoService.remove(id);
  }
}