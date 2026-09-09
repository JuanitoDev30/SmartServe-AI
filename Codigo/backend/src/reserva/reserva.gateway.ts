import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Reserva } from './entities/reserva.entity';

const SALA_RESERVAS = 'sala.reservas';

@WebSocketGateway({
  cors: {
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:3000'],
    credentials: true,
  },
  namespace: 'reservas',
})
export class ReservaGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ReservaGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('suscribir.reservas')
  handleSuscribir(client: Socket) {
    client.join(SALA_RESERVAS);
    this.logger.log(`Cliente ${client.id} se ha suscrito a las reservas`);
  }

  emitirNuevaReserva(reserva: Reserva) {
    this.logger.log(`Emitiendo reserva.nueva: ${reserva.id}`);
    this.server.to(SALA_RESERVAS).emit('reserva.nueva', reserva);
  }

  emitirReservaActualizada(reserva: Reserva) {
    this.logger.log(`Emitiendo reserva.actualizada: ${reserva.id}`);
    this.server.to(SALA_RESERVAS).emit('reserva.actualizada', reserva);
  }

  emitirReservaEliminada(id: string) {
    this.logger.log(`Emitiendo reserva.eliminada: ${id}`);
    this.server.to(SALA_RESERVAS).emit('reserva.eliminada', { id });
  }
}
