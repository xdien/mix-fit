// websocket/websocket.gateway.ts
import { Logger, UseGuards } from '@nestjs/common';
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
  path: '/websockets',
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

  constructor(private readonly websocketService: WebsocketService) {}

  afterInit(_server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  @UseGuards(WsAuthGuard)
  async handleConnection(client: WebSocket, ...args: unknown[]) {
    try {
      const headers = args[0] as {
        authorization?: string;
        Authorization?: string;
      };
      const token = this.extractTokenFromHeader(headers);
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

  private extractTokenFromHeader(headers: {
    authorization?: string;
    Authorization?: string;
  }): string {
    const authHeader = headers.authorization ?? headers.Authorization;

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
