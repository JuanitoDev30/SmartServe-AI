import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { ProductoModule } from './producto/producto.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteModule } from './cliente/cliente.module';
import { CommonModule } from './common/common.module';
import { PedidoModule } from './pedido/pedido.module';
import { VentasModule } from './ventas/ventas.module';
import { CategoriaModule } from './categoria/categoria.module';
import { ChatModule } from './chat/chat.module';
import { AdministradorModule } from './administrador/administrador.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { DashboardModule } from './dashboard/dashboard.module';
import { ReportesModule } from './reportes/reportes.module';
import { SearchModule } from './search/search.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ProyectoModule } from './proyecto/proyecto.module';
import { ProspectoModule } from './prospecto/prospecto.module';
import { ReunionModule } from './reunion/reunion.module';
import { AnaliticasModule } from './analiticas/analiticas.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 segundo
        limit: 10, // máximo 10 requests por segundo
      },
      {
        name: 'medium',
        ttl: 60000, // 1 minuto
        limit: 100, // máximo 100 requests por minuto
      },
      {
        name: 'long',
        ttl: 3600000, // 1 hora
        limit: 1000, // máximo 1000 requests por hora
      },
    ]),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
    }),
    ProductoModule,
    ClienteModule,
    CommonModule,
    PedidoModule,
    VentasModule,
    CategoriaModule,
    ChatModule,
    AdministradorModule,
    AuthModule,
    ScheduleModule.forRoot(),
    DashboardModule,
    ReportesModule,
    SearchModule,
    ProyectoModule,
    ProspectoModule,
    ReunionModule,
    AnaliticasModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }, AppService],
})
export class AppModule {}
