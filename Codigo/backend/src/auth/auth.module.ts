import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdministradorModule } from 'src/administrador/administrador.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { BootstrapController } from './boostrap.controller';

@Module({
  controllers: [AuthController, BootstrapController],
  providers: [AuthService, JwtStrategy],
  imports: [
    AdministradorModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '8h' },
    }),
  ],
  exports: [JwtService],
})
export class AuthModule {}
