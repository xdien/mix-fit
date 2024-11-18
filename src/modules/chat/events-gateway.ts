import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class EventsGateway implements OnGatewayInit {
  @WebSocketServer()
  server!: Server;

  afterInit(_server: Server) {
    console.log('WebSocket Initialized');
  }

  @SubscribeMessage('message')
  handleMessage(_client: unknown, _payload: unknown): string {
    return 'Hello world!';
  }
}