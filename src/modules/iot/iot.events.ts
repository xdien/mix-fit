import { ApiProperty } from '@nestjs/swagger';

import { TelemetryPayloadDto } from './dtos/telemetry.dto';

export enum IoTEvents {
  // Sensor events
  SENSOR_DATA = 'sensor_data',
  SENSOR_STATUS = 'sensor_status',
  SENSOR_ALERT = 'sensor_alert',
  SENSOR_DATA_MONITORING = 'sensor_data_monitoring',

  // Control events
  CONTROL_COMMAND = 'control_command',
  CONTROL_STATUS = 'control_status',

  // Device events
  DEVICE_CONNECTED = 'device_connected',
  DEVICE_DISCONNECTED = 'device_disconnected',
  DEVICE_STATUS = 'device_status',
}

export class IoTEventDto {
  @ApiProperty({
    description: 'IoT event type',
    enum: IoTEvents,
    example: IoTEvents.SENSOR_DATA,
    enumName: 'IoTEvents',
  })
  eventType!: IoTEvents;
}

export class SensorDataEventDto extends IoTEventDto {
  @ApiProperty({
    description: 'Telemetry data',
    type: TelemetryPayloadDto,
  })
  telemetryData!: TelemetryPayloadDto;
}

export class ControlCommandEventDto extends IoTEventDto {
  @ApiProperty({
    description: 'Unique identifier of the device',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  deviceId!: string;

  @ApiProperty({
    description: 'Command identifier',
    example: 'SET_TEMPERATURE',
  })
  command!: string;

  @ApiProperty({
    description: 'Command parameters',
    example: { targetTemp: 23, fanSpeed: 'high' },
  })
  parameters!: Record<string, unknown>;

  @ApiProperty({
    description: 'Command priority',
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    default: 'MEDIUM',
    required: false,
  })
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';

  @ApiProperty({
    description: 'Command timestamp',
    example: '2025-01-21T14:30:00Z',
  })
  timestamp!: string;
}

export class DeviceStatusEventDto extends IoTEventDto {
  @ApiProperty({
    description: 'Unique identifier of the device',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  deviceId!: string;

  @ApiProperty({
    description: 'Device status',
    enum: ['ONLINE', 'OFFLINE', 'MAINTENANCE', 'ERROR'],
    example: 'ONLINE',
  })
  status!: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE' | 'ERROR';

  @ApiProperty({
    description: 'Last heartbeat timestamp',
    example: '2025-01-21T14:30:00Z',
  })
  lastHeartbeat!: string;

  @ApiProperty({
    description: 'Battery level percentage',
    minimum: 0,
    maximum: 100,
    example: 85,
    required: false,
  })
  batteryLevel?: number;

  @ApiProperty({
    description: 'Firmware version',
    example: 'v1.2.3',
    required: false,
  })
  firmwareVersion?: string;

  @ApiProperty({
    description: 'Device IP address',
    example: '192.168.1.100',
    required: false,
  })
  ipAddress?: string;

  @ApiProperty({
    description: 'Signal strength in dBm',
    example: -65,
    required: false,
  })
  signalStrength?: number;
}

export class SensorAlertEventDto extends IoTEventDto {
  @ApiProperty({
    description: 'Unique identifier of the device',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  deviceId!: string;

  @ApiProperty({
    description: 'Identifier of the sensor',
    example: 'temp_sensor_01',
  })
  sensorId!: string;

  @ApiProperty({
    description: 'Type of alert',
    enum: ['THRESHOLD_EXCEEDED', 'MALFUNCTION', 'CALIBRATION_NEEDED'],
    example: 'THRESHOLD_EXCEEDED',
  })
  alertType!: 'THRESHOLD_EXCEEDED' | 'MALFUNCTION' | 'CALIBRATION_NEEDED';

  @ApiProperty({
    description: 'Alert severity level',
    enum: ['INFO', 'WARNING', 'CRITICAL'],
    example: 'WARNING',
  })
  severity!: 'INFO' | 'WARNING' | 'CRITICAL';

  @ApiProperty({
    description: 'Current sensor value',
    example: 35.5,
    required: false,
  })
  value?: number;

  @ApiProperty({
    description: 'Threshold value that was exceeded',
    example: 30,
    required: false,
  })
  threshold?: number;

  @ApiProperty({
    description: 'Alert message',
    example: 'Temperature exceeds maximum threshold',
    required: false,
  })
  message?: string;

  @ApiProperty({
    description: 'Alert timestamp',
    example: '2025-01-21T14:30:00Z',
  })
  timestamp!: string;
}
