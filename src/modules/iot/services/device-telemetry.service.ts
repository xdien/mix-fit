import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { SensorDataEventDto } from 'modules/iot/iot.events';
import { LessThan, Repository } from 'typeorm';

import { SocketService } from '../../../websocket/websocket.service';
import type { TelemetryPayloadDto } from '../../device-telemetry/dtos/telemetry.dto';
import { DeviceTelemetryEntity } from '../entity/device-telemetry.entity';

@Injectable()
export class DeviceTelemetryService {
  private readonly logger = new Logger(DeviceTelemetryService.name);

  constructor(
    @InjectRepository(DeviceTelemetryEntity)
    private telemetryRepo: Repository<DeviceTelemetryEntity>,
    private websocketService: SocketService,
  ) {}

  async saveTelemetryBatch(payload: TelemetryPayloadDto): Promise<void> {
    const timestamp = payload.timestamp ?? new Date();
    this.logger.log(typeof payload);
    const entities = payload.metrics.map((metric) => {
      const telemetry = new DeviceTelemetryEntity();
      telemetry.deviceId = payload.deviceId;
      telemetry.time = timestamp;
      telemetry.metadata = metric.metadata ?? {};
      telemetry.setValue(metric.value);

      return telemetry;
    });

    try {
      await this.telemetryRepo.save(entities);
      this.logger.log(
        `Saved ${entities.length} metrics for device ${payload.deviceId}`,
      );
    } catch (error) {
      this.logger.error(
        `Error saving telemetry for device ${payload.deviceId}: ${(error as Error).message}`,
      );

      throw error;
    }
  }

  async getLatestMetrics(
    deviceId: string,
    metricNames?: string[],
  ): Promise<DeviceTelemetryEntity[]> {
    const query = this.telemetryRepo
      .createQueryBuilder('t1')
      .where('t1.device_id = :deviceId', { deviceId });

    if (metricNames?.length) {
      query.andWhere('t1.metric_name IN (:...metricNames)', { metricNames });
    }

    // Subquery để lấy timestamp mới nhất cho mỗi metric
    query.andWhere(
      `(t1.device_id, t1.metric_name, t1.time) IN (
        SELECT t2.device_id, t2.metric_name, MAX(t2.time) as max_time
        FROM device_telemetry t2
        WHERE t2.device_id = :deviceId
        ${metricNames?.length ? 'AND t2.metric_name IN (:...metricNames)' : ''}
        GROUP BY t2.device_id, t2.metric_name
      )`,
    );

    return query.getMany();
  }

  async getMetricHistory(
    deviceId: string,
    metricName: string,
    startTime: Date,
    endTime: Date,
    aggregateMinutes?: number,
  ): Promise<unknown[]> {
    const query = this.telemetryRepo
      .createQueryBuilder('t')
      .where('t.device_id = :deviceId', { deviceId })
      .andWhere('t.metric_name = :metricName', { metricName })
      .andWhere('t.created_at BETWEEN :startTime AND :endTime', {
        startTime,
        endTime,
      });

    if (aggregateMinutes) {
      // Sử dụng time_bucket của TimescaleDB nếu có
      return query
        .select([
          `time_bucket('${aggregateMinutes} minutes', t.created_at) as time`,
          't.metric_name',
          'AVG(t.numeric_value) as avg_value',
          'MAX(t.numeric_value) as max_value',
          'MIN(t.numeric_value) as min_value',
          'COUNT(*) as sample_count',
        ])
        .groupBy('time_bucket, t.metric_name')
        .orderBy('time_bucket', 'ASC')
        .getRawMany();
    }

    return query.orderBy('t.created_at', 'ASC').getMany();
  }

  async deleteOldData(retentionDays: number): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    await this.telemetryRepo.delete({
      time: LessThan(cutoffDate),
    });

    this.logger.log(`Deleted telemetry data older than ${retentionDays} days`);
  }

  // push data to monitoring dashboard
  broadcastToMonitor(event: SensorDataEventDto): void {
    this.logger.log(
      `Broadcasting sensor data to monitoring dashboard ${JSON.stringify(event)}`,
    );
    this.websocketService.broadcastToMonitor(event);
  }
}
