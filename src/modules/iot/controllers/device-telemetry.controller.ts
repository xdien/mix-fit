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

import { RoleType } from '../../../constants';
import { Auth } from '../../../decorators';
import { MetricDto, TelemetryPayloadDto } from '../dtos/telemetry.dto';
import {
  DeviceStatusEventDto,
  IoTEvents,
  SensorDataEventDto,
} from '../iot.events';
import { DeviceRegistryService } from '../services/device-registry.service';
import { DeviceTelemetryService } from '../services/device-telemetry.service';

@Controller('telemetry')
@ApiTags('Telemetry')
@ApiExtraModels(SensorDataEventDto, MetricDto, DeviceStatusEventDto)
export class DeviceTelemetryController {
  private readonly logger = new Logger(DeviceTelemetryController.name);

  constructor(
    private readonly deviceRegistryService: DeviceRegistryService,
    private readonly telemetryService: DeviceTelemetryService,
  ) {}

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

  @EventPattern('devices/+/telemetry/+')
  //   @Auth([RoleType.USER])
  async handleTelemetryEvent(
    @Payload() message: TelemetryPayloadDto,
    @Ctx() context: MqttContext,
  ) {
    try {
      const deviceType = context.getTopic().split('/')[1];
      const deviceId = context.getTopic().split('/')[3];

      if (!deviceType) {
        throw new Error('Device ID not found in topic');
      }

      if (!deviceId) {
        throw new Error('Device type not found in topic');
      }

      this.logger.debug('Message received: ' + JSON.stringify(message));

      const handler = this.deviceRegistryService.getHandler(deviceType);
      const transformedData: TelemetryPayloadDto = handler
        ? ((await handler.transformTelemetry(message)) as TelemetryPayloadDto)
        : message;

      await this.telemetryService.saveTelemetryBatch(transformedData);

      const temperatureCloudevent: SensorDataEventDto = {
        telemetryData: {
          deviceId,
          deviceType,
          timestamp: new Date(),
          metrics: transformedData.metrics,
        },
        eventType: IoTEvents.SENSOR_DATA_MONITORING,
      };

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
}
