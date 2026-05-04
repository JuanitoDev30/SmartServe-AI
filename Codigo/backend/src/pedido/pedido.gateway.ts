import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
  namespace: 'pedidos',
})
export class PedidoGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(PedidoGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id} `);
  }
  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id} `);
  }

  // Suscripcion a los pedidos por  el cliente

  @SubscribeMessage('suscribir.pedidos')
  handleSuscribir(client: Socket) {
    client.join('sala.pedidos');
    this.logger.log(`Cliente ${client.id} se ha suscrito a los pedidos`);
  }

  emitirNuevoPedido(pedido: any) {
    this.logger.log(
      `Emitido nuevo pedido a sala.pedidos: ${JSON.stringify(pedido)}`,
    );
    this.server.to('sala.pedidos').emit('pedido.nuevo', pedido);
  }

  emitirPedidoActualizado(pedido: any) {
    this.server.to('sala.pedidos').emit('pedido.actualizado', pedido);
  }
}
