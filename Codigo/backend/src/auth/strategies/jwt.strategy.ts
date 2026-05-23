import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AdministradorService } from '../../administrador/administrador.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly administradorService: AdministradorService) {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET no está definido');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: { sub: string; email: string; nombre: string }) {
    try {
      const admin = await this.administradorService.findOne(payload.sub);

      if (!admin || !admin.activo) {
        throw new UnauthorizedException('Token inválido');
      }

      return {
        id: admin.id,
        email: admin.email,
        nombre: admin.nombre,
      };
    } catch (error) {
      throw error;
    }
  }
}
