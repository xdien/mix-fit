import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WebsocketModule } from '../../websocket/websocket.module';
import { DeviceTelemetryController } from '../iot/controllers/device-telemetry.controller';
import { DeviceTelemetryEntity } from '../iot/entity/device-telemetry.entity';
import { DeviceTelemetryService } from '../iot/services/device-telemetry.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeviceTelemetryEntity], 'default'),
    WebsocketModule,
  ],
  controllers: [DeviceTelemetryController],
  exports: [DeviceTelemetryService],
  providers: [DeviceTelemetryService],
})
export class DeviceTelemetryModule {}
