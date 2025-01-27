import { UseGuards } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Namespace } from 'socket.io';

import { WsAuthGuard } from '../../guards/ws-auth.guard';

@WebSocketGateway({
  namespace: '/iot',
  cors: true,
})
@UseGuards(WsAuthGuard)
export class IoTGateway {
  @WebSocketServer()
  server!: Namespace;

  //   constructor(private readonly iotService: IoTService) {}
  /*
  @SubscribeMessage(IoTEvents.DEVICE_STATUS)
  async handleDeviceStatus(client: Socket, payload: DeviceStatus) {
    const deviceId = payload.deviceId;

    // Update device status
    await this.iotService.updateDeviceStatus(payload);

    // If device is offline, handle disconnection
    if (payload.status === 'OFFLINE') {
      client.leave(`device:${deviceId}`);
      this.server.emit(IoTEvents.DEVICE_DISCONNECTED, { deviceId });
    }

    // Broadcast status update
    this.server.emit(IoTEvents.DEVICE_STATUS, payload);
  }

  // Handle device connection
  async handleConnection(client: Socket) {
    const deviceId = client.handshake.auth.deviceId;

    if (!deviceId) {
      client.disconnect();

      return;
    }

    // Join device room
    client.join(`device:${deviceId}`);

    // Update device status to ONLINE
    const status: DeviceStatus = {
      deviceId,
      status: 'ONLINE',
      lastHeartbeat: new Date().toISOString(),
    };

    await this.iotService.updateDeviceStatus(status);
    this.server.emit(IoTEvents.DEVICE_CONNECTED, { deviceId });
  }

  // Handle device disconnection
  async handleDisconnect(client: Socket) {
    const deviceId = client.handshake.auth.deviceId as string;

    if (deviceId) {
      const status: DeviceStatusEventDto = {
        deviceId,
        status: 'OFFLINE',
        lastHeartbeat: new Date().toISOString(),
      };

      await this.iotService.updateDeviceStatus(status);
      this.server.emit(IoTEvents.DEVICE_DISCONNECTED, { deviceId });
    }
  }
    */
}
