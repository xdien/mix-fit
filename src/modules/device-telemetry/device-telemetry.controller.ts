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
import { DeviceTelemetryService } from './device-telemetry.service';
import { TelemetryPayloadDto } from './dtos/telemetry.dto';
import { OilTemperatureEvent } from './dtos/temperature-event.dto';
import type {
  IMetric,
  IMetricWithMetadata,
  ITelemetryPayload,
  Metadata,
  MetadataValue,
  MetricValue,
} from './telemetry.types';

interface ITelemetryMessage {
  timestamp?: string;
  metadata?: Record<string, unknown>;
  [key: string]: unknown; // Cho phép các field động
}

@Controller('telemetry')
@ApiTags('Telemetry')
@ApiExtraModels(OilTemperatureEvent)
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

  private transformToTelemetryPayload(
    deviceId: string,
    data: ITelemetryMessage,
  ): ITelemetryPayload {
    const timestamp =
      data.timestamp == null ? new Date() : new Date(data.timestamp);
    const globalMetadata: Metadata = this.sanitizeMetadata(data.metadata ?? {});

    const dataClone = { ...data };
    delete dataClone.metadata;
    delete dataClone.timestamp;

    const metrics = Object.entries(dataClone).map(([key, value]): IMetric => {
      let processedValue: MetricValue = value as MetricValue;
      let metadata: Metadata = { ...globalMetadata };

      if (this.isMetricWithMetadata(value)) {
        processedValue = value.value;

        if (value.metadata) {
          // Sanitize và merge metadata
          const sanitizedMetadata = this.sanitizeMetadata(value.metadata);
          metadata = { ...metadata, ...sanitizedMetadata };
        }
      }

      return {
        name: key,
        value: processedValue,
        metadata,
      };
    });

    return {
      device_id: deviceId,
      timestamp,
      metrics,
    };
  }

  private isUrlObject(obj: unknown): obj is { url: string } {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'url' in obj &&
      typeof (obj as { url: unknown }).url === 'string'
    );
  }

  private isValidMetricValue(value: unknown): value is MetricValue {
    if (
      typeof value === 'number' ||
      typeof value === 'string' ||
      typeof value === 'boolean'
    ) {
      return true;
    }

    return this.isUrlObject(value);
  }

  private isMetricWithMetadata(value: unknown): value is IMetricWithMetadata {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    const candidate = value as Record<string, unknown>;

    if (!('value' in candidate)) {
      return false;
    }

    return this.isValidMetricValue(candidate.value);
  }

  private sanitizeMetadata(data: Record<string, unknown>): Metadata {
    const sanitized: Metadata = {};

    for (const [key, value] of Object.entries(data)) {
      sanitized[key] =
        value === null ||
        value === undefined ||
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean'
          ? (value as MetadataValue)
          : JSON.stringify(value);
    }

    return sanitized;
  }

  @EventPattern('devices/+/telemetry')
  //   @Auth([RoleType.USER])
  async handleTelemetryEvent(
    @Payload() message: ITelemetryMessage,
    @Ctx() context: MqttContext,
  ) {
    this.logger.debug(`Received telemetry data: ${JSON.stringify(message)}`);

    try {
      const deviceId = context.getTopic().split('/')[1];

      if (!deviceId) {
        throw new Error('Device ID not found in topic');
      }

      const telemetryData = this.transformToTelemetryPayload(deviceId, message);
      await this.telemetryService.saveTelemetryBatch(telemetryData);
      const temperatureCloudevent = {
        specversion: '1.0',
        type: 'temperature',
        source: 'device/1',
        id: 'A234-1234-1234',
        time: new Date().toISOString(),
        datacontenttype: 'application/json',
        data: {
          temperature: telemetryData.metrics[0]?.value as number,
          deviceId: 'device-1',
          timestamp: new Date(),
        },
      };
      await this.telemetryService.pushDataToWebsocket(temperatureCloudevent);
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
