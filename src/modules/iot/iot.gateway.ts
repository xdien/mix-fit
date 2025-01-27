import { UseGuards } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';

import { WsAuthGuard } from '../../guards/ws-auth.guard';
import { IoTEvents } from './iot.events';
import { IoTService } from './iot.service';

@WebSocketGateway({
  namespace: '/iot',
  cors: true,
})
@UseGuards(WsAuthGuard)
export class IoTGateway {
  @WebSocketServer()
  server!: Namespace;

  constructor(private readonly iotService: IoTService) {}

  @SubscribeMessage(IoTEvents.SENSOR_DATA)
  async handleSensorData(client: Socket, payload: SensorData) {
    // Validate and process sensor data
    await this.iotService.processSensorData(payload);

    // Broadcast to subscribers of this device
    this.server
      .to(`device:${payload.deviceId}`)
      .emit(IoTEvents.SENSOR_DATA, payload);

    // Check for alerts
    const alert = await this.iotService.checkSensorAlerts(payload);

    if (alert) {
      this.server
        .to(`device:${payload.deviceId}`)
        .emit(IoTEvents.SENSOR_ALERT, alert);
    }
  }

  @SubscribeMessage(IoTEvents.CONTROL_COMMAND)
  async handleControlCommand(client: Socket, payload: ControlCommand) {
    // Process and validate control command
    const status = await this.iotService.processControlCommand(payload);

    // Send to specific device
    this.server
      .to(`device:${payload.deviceId}`)
      .emit(IoTEvents.CONTROL_COMMAND, payload);

    // Emit command status
    this.server
      .to(`device:${payload.deviceId}`)
      .emit(IoTEvents.CONTROL_STATUS, status);
  }

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
      const status: DeviceStatus = {
        deviceId,
        status: 'OFFLINE',
        lastHeartbeat: new Date().toISOString(),
      };

      await this.iotService.updateDeviceStatus(status);
      this.server.emit(IoTEvents.DEVICE_DISCONNECTED, { deviceId });
    }
  }
}
