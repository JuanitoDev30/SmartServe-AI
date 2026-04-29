import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { EstadoPedido } from './enum/pedidoEstado.enum';

@Controller('pedido')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post()
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidoService.create(createPedidoDto);
  }

  @Get()
  findAll() {
    return this.pedidoService.findAll();
  }

  // GET por estado: /pedido/estado?estado=PENDIENTE
  @Get('estado')
  findByEstado(@Query('estado') estado: EstadoPedido) {
    return this.pedidoService.findByEstado(estado);
  }

  // GET por usuario: /pedido/usuario/:id
  @Get('usuario/:id')
  findByUsuario(@Param('id', ParseUUIDPipe) usuarioId: string) {
    return this.pedidoService.findByCliente(usuarioId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.pedidoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePedidoDto: UpdatePedidoDto,
  ) {
    return this.pedidoService.update(id, updatePedidoDto);
  }
}
