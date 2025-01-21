import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Server, Socket } from 'socket.io';

import type { IAuthPayload } from './interfaces/auth-payload.interface';

@Injectable()
export class SocketService {
  private readonly logger = new Logger(SocketService.name);

  private io?: Server;

  constructor(private readonly jwtService: JwtService) {}

  initializeSocket(server: Server) {
    this.io = server;
  }

  async handleConnection(client: Socket) {
    try {
      const token: string = client.handshake.auth.token as string;
      const payload = await this.authenticateClient(token);

      // Store user data in socket
      client.data.userId = payload.userId;

      void client.join(payload.userId);

      this.logger.log(`Client ${payload.userId} connected`);
    } catch (error) {
      client.disconnect();
      this.logger.error(`Authentication failed: ${error.message}`);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client ${client.data.userId as string} disconnected`);
  }

  async authenticateClient(token: string): Promise<IAuthPayload> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch {
      throw new Error('Invalid token');
    }
  }

  broadcastToAuthenticatedUsers(event: string, message: unknown): void {
    this.io?.emit(event, message);
  }

  // Broadcast to specific room/channel
  broadcastToChannel(channelId: string, event: string, message: unknown) {
    this.io?.to(channelId).emit(event, message);
  }
}
