import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { SensorDataEventDto } from 'modules/iot/iot.events';
import type { Server, Socket } from 'socket.io';

import { IoTEvents } from '../modules/iot/iot.events';
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

  // Broadcast to broadcast room with event SensorDataEventDto
  broadcastToMonitor(data: SensorDataEventDto) {
    this.logger.log(
      `Broadcasting to monitoring deviceId: ${data.telemetryData.deviceId}`,
    );
    this.io?.emit(
      IoTEvents.SENSOR_DATA_MONITORING + '/' + data.telemetryData.deviceId,
      data,
    );
  }

  // Broadcast to specific room/channel
  broadcastToChannel(channelId: string, event: string, message: unknown) {
    this.io?.to(channelId).emit(event, message);
  }

  // Emit to specific client
  emitToClient(clientId: string, event: string, message: unknown) {
    this.io?.to(clientId).emit(event, message);
  }
}
