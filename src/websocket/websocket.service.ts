// websocket/websocket.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WebSocket } from 'ws';

import type { IAuthPayload } from './interfaces/auth-payload.interface';
import type { ISocketClient } from './interfaces/socket-client.interface';

@Injectable()
export class WebsocketService {
  private readonly logger = new Logger(WebsocketService.name);

  private readonly clients = new Map<string, ISocketClient>();

  private readonly heartbeatInterval = 30_000;

  private readonly heartbeatTimeout = 5000;

  constructor(private readonly jwtService: JwtService) {}

  registerClient(client: WebSocket, payload: IAuthPayload): void {
    const socketClient: ISocketClient = {
      id: payload.userId,
      token: payload.token,
      lastHeartbeat: Date.now(),
      isAlive: true,
      ws: client,
    };

    this.clients.set(payload.userId, socketClient);
    this.setupHeartbeat(client, payload.userId);
  }

  private setupHeartbeat(client: WebSocket, userId: string): void {
    const interval = setInterval(() => {
      const socketClient = this.clients.get(userId);

      if (!socketClient?.isAlive) {
        this.removeClient(userId);
        clearInterval(interval);

        return;
      }

      socketClient.isAlive = false;
      this.clients.set(userId, socketClient);

      client.send(JSON.stringify({ type: 'ping' }));

      setTimeout(() => {
        const currentClient = this.clients.get(userId);

        if (currentClient && !currentClient.isAlive) {
          this.removeClient(userId);
          clearInterval(interval);
          client.close();
        }
      }, this.heartbeatTimeout);
    }, this.heartbeatInterval);

    client.on('close', () => {
      clearInterval(interval);
      this.removeClient(userId);
    });
  }

  async authenticateClient(token: string): Promise<IAuthPayload> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch {
      throw new Error('Invalid token');
    }
  }

  handlePong(userId: string): void {
    const client = this.clients.get(userId);

    if (client) {
      client.isAlive = true;
      client.lastHeartbeat = Date.now();
      this.clients.set(userId, client);
    }
  }

  handlePing(userId: string): void {
    const client = this.clients.get(userId);

    if (client?.isAlive) {
      client.ws.send(JSON.stringify({ type: 'pong' }));
    }
  }

  removeClient(userId: string): void {
    const client = this.clients.get(userId);

    if (client?.ws) {
      client.ws.close();
    }

    this.clients.delete(userId);
    this.logger.log(`Client ${userId} removed`);
  }

  broadcastToAuthenticatedUsers(message: unknown): void {
    for (const [, client] of this.clients) {
      if (client.isAlive && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message));
      }
    }
  }
}
