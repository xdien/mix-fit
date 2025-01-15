// websocket/websocket.gateway.ts
import { forwardRef, Inject, Logger, UseGuards } from '@nestjs/common';
import type {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';

import { WsAuthGuard } from '../guards/ws-auth.guard';
import type { IAuthPayload } from './interfaces/auth-payload.interface';
import { WebsocketService } from './websocket.service';

@WebSocketGateway({
  path: '/ws',
  cors: {
    origin: '*',
  },
})
export class WebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private logger: Logger = new Logger('WebsocketGateway');

  constructor(
    @Inject(forwardRef(() => WebsocketService))
    private readonly websocketService: WebsocketService,
  ) {}

  afterInit(_server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  @UseGuards(WsAuthGuard)
  async handleConnection(client: WebSocket, ...args: unknown[]) {
    try {
      const headers = args[0];
      const token = this.extractTokenFromHeader(
        headers as { rawHeaders: string[] },
      );
      const payload: IAuthPayload =
        await this.websocketService.authenticateClient(token);

      this.websocketService.registerClient(client, payload);

      client.send(
        JSON.stringify({
          type: 'connection',
          status: 'authenticated',
        }),
      );
    } catch {
      client.send(
        JSON.stringify({
          type: 'error',
          message: 'Authentication failed',
        }),
      );
      client.close();
    }
  }

  handleDisconnect(_client: WebSocket) {
    this.logger.log('Client disconnected');
  }

  @SubscribeMessage('pong')
  handlePong(client: WebSocket, userId: string): void {
    Logger.log(`Received pong from ${client.eventNames()}`);
    this.websocketService.handlePong(userId);
  }

  private extractTokenFromHeader(headers: { rawHeaders: string[] }): string {
    const arrayHeaders = headers.rawHeaders;

    if (arrayHeaders.length > 0) {
      const authIndex = arrayHeaders.findIndex(
        (h: string) => h.toLowerCase() === 'authorization',
      );

      if (authIndex >= 0) {
        const authHeader = headers.rawHeaders[authIndex + 1];

        if (!authHeader) {
          throw new Error('No authorization header');
        }

        const [type, token] = authHeader.split(' ');

        if (type !== 'Bearer' || !token) {
          throw new Error('Invalid token type');
        }

        return token;
      }
    }

    throw new Error('No authorization header');
  }
}
