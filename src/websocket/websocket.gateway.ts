import { Logger } from '@nestjs/common';
import type {
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import type { Socket } from 'socket.io';
import { Server } from 'socket.io';

import { SocketService } from './websocket.service';

@WebSocketGateway({
  cors: {
    origin: '*', // Configure according to your needs
  },
  transports: ['websocket', 'polling'],
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  readonly logger: Logger = new Logger(SocketGateway.name);

  constructor(private readonly socketService: SocketService) {}

  afterInit() {
    this.logger.log('Socket Gateway initialized');
    this.socketService.initializeSocket(this.server);
  }

  async handleConnection(client: Socket) {
    await this.socketService.handleConnection(client);
  }

  handleDisconnect(client: Socket) {
    this.socketService.handleDisconnect(client);
  }
}
