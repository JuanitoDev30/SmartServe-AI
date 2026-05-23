import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AdministradorService } from './administrador.service';
import { CreateAdministradorDto } from './dto/create-administrador.dto';
import { UpdateAdministradorDto } from './dto/update-administrador.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GetCurrentUser } from '../auth/decorators/getCurrentUser.decorator';

@Controller('administrador')
export class AdministradorController {
  constructor(private readonly administradorService: AdministradorService) {}

  @Post()
  create(@Body() dto: CreateAdministradorDto) {
    return this.administradorService.create(dto);
  }

  @Get()
  findAll() {
    return this.administradorService.findAll();
  }

  @Get('perfil')
  getPerfil(@GetCurrentUser() user: any) {
    return this.administradorService.getPerfil(user.id);
  }

  @Patch('perfil')
  updatePerfil(@GetCurrentUser() user: any, @Body() dto: UpdatePerfilDto) {
    return this.administradorService.updatePerfil(user.id, dto);
  }

  @Patch('perfil/password')
  changePassword(@GetCurrentUser() user: any, @Body() dto: ChangePasswordDto) {
    return this.administradorService.changePassword(user.id, dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.administradorService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAdministradorDto,
  ) {
    return this.administradorService.update(id, dto);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.administradorService.deactivate(id);
  }
}
