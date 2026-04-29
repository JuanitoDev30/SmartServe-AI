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

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_USERNAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ProductoModule,
    ClienteModule,
    CommonModule,
    PedidoModule,
    VentasModule,
    CategoriaModule,
    ChatModule,
    AdministradorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
