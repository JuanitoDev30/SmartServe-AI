import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProspectoService } from './prospecto.service';
import { CreateProspectoDto } from './dto/create-prospecto.dto';
import { UpdateProspectoDto } from './dto/update-prospecto.dto';

@Controller('prospecto')
export class ProspectoController {
  constructor(private readonly prospectoService: ProspectoService) {}

  @Post()
  create(@Body() createProspectoDto: CreateProspectoDto) {
    return this.prospectoService.create(createProspectoDto);
  }

  @Get()
  findAll() {
    return this.prospectoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prospectoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProspectoDto: UpdateProspectoDto,
  ) {
    return this.prospectoService.update(id, updateProspectoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prospectoService.remove(id);
  }
}
