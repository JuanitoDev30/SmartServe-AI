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
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post()
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clienteService.create(createClienteDto);
  }

  // Usado por el agente AI: POST /cliente/find-or-create
  @Post('find-or-create')
  findOrCreate(
    @Body() body: { nombre: string; telefono: string; email?: string },
  ) {
    return this.clienteService.findOrCreate(
      body.nombre,
      body.telefono,
      body.email,
    );
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.clienteService.findAll(paginationDto);
  }

  // GET /cliente/telefono/3001234567
  @Get('telefono/:telefono')
  findByTelefono(@Param('telefono') telefono: string) {
    return this.clienteService.findByTelefono(telefono);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.clienteService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClienteDto: UpdateClienteDto,
  ) {
    return this.clienteService.update(id, updateClienteDto);
  }

  // PATCH /cliente/:id/desactivar — en lugar de DELETE
  @Patch(':id/desactivar')
  desactivar(@Param('id', ParseUUIDPipe) id: string) {
    return this.clienteService.desactivar(id);
  }
}
