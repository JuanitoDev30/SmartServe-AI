import { Controller, Post, Body } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { AdministradorService } from '../administrador/administrador.service';
import { CreateAdministradorDto } from '../administrador/dto/create-administrador.dto';

@Controller('auth')
export class BootstrapController {
  constructor(private readonly administradorService: AdministradorService) {}

  @Public()
  @Post('bootstrap')
  async bootstrap(@Body() dto: CreateAdministradorDto) {
    const admins = await this.administradorService.findAll();

    if (admins.length > 0) {
      return { message: 'Ya existe un administrador, endpoint deshabilitado' };
    }

    const admin = await this.administradorService.create(dto);
    return {
      message: 'Administrador inicial creado exitosamente',
      admin: {
        id: admin.id,
        nombre: admin.nombre,
        email: admin.email,
      },
    };
  }
}
