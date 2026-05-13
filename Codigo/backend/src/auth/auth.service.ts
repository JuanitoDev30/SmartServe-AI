import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdministradorService } from '../administrador/administrador.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly administradorService: AdministradorService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const admin = await this.administradorService.findByEmail(loginDto.email);

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!admin.activo) {
      throw new UnauthorizedException('Account is not active');
    }

    const passwordValid = await bcrypt.compare(
      loginDto.password,
      admin.password,
    );

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: admin.id,
      email: admin.email,
      nombre: admin.nombre,
    };

    return {
      access_token: this.jwtService.sign(payload),
      admin: {
        id: admin.id,
        email: admin.email,
        nombre: admin.nombre,
      },
    };
  }
}
