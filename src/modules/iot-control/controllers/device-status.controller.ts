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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../../constants';
import { Auth } from '../../../decorators';

@Controller('iot')
@ApiTags('IoT')
export class DeviceStatusController {
  private readonly logger = new Logger(DeviceStatusController.name);

  constructor(private readonly telemetryService: DeviceCon) {}

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
}
