import { Injectable } from '@nestjs/common';
import type { SensorDataEventDto } from 'modules/iot/iot.events';
import { SocketService } from 'websocket/websocket.service';

@Injectable()
export class IoTService {
  constructor(socketService: SocketService) {
    this.socketService = socketService;
  }

  async handleSensorDataMonitoring(payload: SensorDataEventDto) {
    // Handle sensor data monitoring
    this.socketService.emit('sensor_data_monitor', payload);
  }
}
