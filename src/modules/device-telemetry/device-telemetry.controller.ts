import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { Ctx, EventPattern, MqttContext, Payload } from '@nestjs/microservices';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { Auth } from '../../decorators';
import {
  DeviceStatusEventDto,
  IoTEvents,
  SensorDataEventDto,
} from '../../modules/iot/iot.events';
import { DeviceTelemetryService } from './device-telemetry.service';
import { MetricDto, TelemetryPayloadDto } from './dtos/telemetry.dto';
import { OilTemperatureEvent } from './dtos/temperature-event.dto';

// @Injectable()
// export class ParseTelemetryPipe
//   implements PipeTransform<unknown, TelemetryPayloadDto>
// {
//   transform(value: unknown): TelemetryPayloadDto {
//     if (typeof value !== 'string') {
//       throw new BadRequestException('Invalid payload format');
//     }

//     const parsed = JSON.parse(value);

//     // Add validation logic here if needed
//     return parsed as TelemetryPayloadDto;
//   }
// }

@Controller('telemetry')
@ApiTags('Telemetry')
@ApiExtraModels(
  OilTemperatureEvent,
  SensorDataEventDto,
  MetricDto,
  DeviceStatusEventDto,
)
export class DeviceTelemetryController {
  private readonly logger = new Logger(DeviceTelemetryController.name);

  constructor(private readonly telemetryService: DeviceTelemetryService) {}

  @Post()
  @Auth([RoleType.USER])
  @ApiOperation({ summary: 'Save device telemetry data' })
  @ApiOperation({
    summary: 'Save device telemetry data',
    description:
      'Saves a batch of telemetry data for a specific device including multiple metrics',
  })
  @ApiResponse({
    status: 201,
    description: 'The telemetry data has been successfully saved',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid payload format',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async saveTelemetry(@Body() payload: TelemetryPayloadDto): Promise<void> {
    await this.telemetryService.saveTelemetryBatch(payload);
  }

  @Get(':deviceId/latest')
  @Auth([RoleType.USER])
  @ApiOperation({ summary: 'Get latest metrics for device' })
  async getLatestMetrics(
    @Param('deviceId') deviceId: string,
    @Query('metrics') metrics?: string, // comma-separated metric names
  ) {
    const metricNames = metrics?.split(',');

    return this.telemetryService.getLatestMetrics(deviceId, metricNames);
  }

  @Get(':deviceId/history/:metricName')
  @Auth([RoleType.USER])
  @ApiOperation({ summary: 'Get metric history for device' })
  async getMetricHistory(
    @Param('deviceId') deviceId: string,
    @Param('metricName') metricName: string,
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
    @Query('aggregateMinutes', new ParseIntPipe({ optional: true }))
    aggregateMinutes?: number,
  ) {
    return this.telemetryService.getMetricHistory(
      deviceId,
      metricName,
      new Date(startTime),
      new Date(endTime),
      aggregateMinutes,
    );
  }

  @EventPattern('devices/+/telemetry')
  //   @Auth([RoleType.USER])
  async handleTelemetryEvent(
    @Payload() message: TelemetryPayloadDto,
    @Ctx() context: MqttContext,
  ) {
    // this.logger.debug(`Received telemetry data: ${JSON.stringify(message)}`);

    try {
      const deviceId = context.getTopic().split('/')[1];

      if (!deviceId) {
        throw new Error('Device ID not found in topic');
      }

      let temperatureCloudevent: SensorDataEventDto;

      if (deviceId === 'esp8266_001') {
        // only process telemetry data from specific device
        const dataEvent = this.transformTelemetryPayload(message);
        await this.telemetryService.saveTelemetryBatch(dataEvent);
        temperatureCloudevent = {
          telemetryData: dataEvent,
          eventType: IoTEvents.SENSOR_DATA_MONITORING,
        };
      } else {
        await this.telemetryService.saveTelemetryBatch(message);
        temperatureCloudevent = {
          telemetryData: {
            deviceId,
            timestamp: new Date(),
            metrics: message.metrics,
          },
          eventType: IoTEvents.SENSOR_DATA_MONITORING,
        };
      }

      this.telemetryService.broadcastToMonitor(temperatureCloudevent);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Error processing telemetry: ${error.message}`,
          error.stack,
        );
      }

      throw error;
    }
  }

  transformTelemetryPayload(payload: any): TelemetryPayloadDto {
    const metrics: MetricDto[] = [
      {
        sensorId: payload.idNau,
        name: 'current',
        value: payload.a,
        unit: 'ampere',
        metadata: { type: 'electrical' },
      },
      {
        sensorId: payload.idNau,
        name: 'power',
        value: payload.w,
        unit: 'watt',
        metadata: { type: 'electrical' },
      },
      {
        sensorId: payload.idNau,
        name: 'voltage',
        value: payload.v,
        unit: 'volt',
        metadata: { type: 'electrical' },
      },
      {
        sensorId: payload.idNau,
        name: 'frequency',
        value: payload.f,
        unit: 'hertz',
        metadata: { type: 'electrical' },
      },
      {
        sensorId: payload.idNau,
        name: 'kilowatt_hour',
        value: payload.kw,
        unit: 'kWh',
        metadata: { type: 'energy' },
      },
      {
        sensorId: payload.idNau,
        name: 'oil_temperature',
        value: payload.tDau,
        unit: 'celsius',
        metadata: { type: 'temperature' },
      },
      {
        sensorId: payload.idNau,
        name: 'water_temperature',
        value: payload.tNuoc,
        unit: 'celsius',
        metadata: { type: 'temperature' },
      },
    ];

    return {
      deviceId: payload.device_id,
      timestamp: new Date(Number.parseInt(payload.tm) * 1000), // Assuming timestamp is in seconds
      metrics,
    };
  }
}
