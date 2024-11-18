import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DeviceTelemetryController } from './device-telemetry.controller';
import { DeviceTelemetryService } from './device-telemetry.service';
import { DeviceTelemetryEntity } from './enties/device-telemetry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceTelemetryEntity], 'default')],
  controllers: [DeviceTelemetryController],
  exports: [DeviceTelemetryService],
  providers: [DeviceTelemetryService],
})
export class DeviceTelemetryModule {}
