import { Logger } from '@nestjs/common';
import type { OnGatewayInit } from '@nestjs/websockets';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class EventsGateway implements OnGatewayInit {
  private readonly logger = new Logger(EventsGateway.name);

  @WebSocketServer()
  server!: Server;

  afterInit(_server: Server) {
    this.logger.log('WebSocket Initialized');
  }

  @SubscribeMessage('message')
  handleMessage(_client: unknown, _payload: unknown): string {
    return 'Hello world!';
  }
}
