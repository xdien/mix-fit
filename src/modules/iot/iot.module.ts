import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QueueNameEnum } from '../../constants/queue-key';
import { MqttService } from '../../mqtt/mqtt.service';
import { SocketService } from '../../websocket/websocket.service';
import { CommandFactory } from './commands/command.factory';
import { CommandProcessor } from './commands/command-v1.processor';
import { IoTCommandController } from './controllers/command.controller';
import { IoTCommandV1Controller } from './controllers/command-v1.controller';
import { DeviceTelemetryController } from './controllers/device-telemetry.controller';
import { DeviceEntity } from './entity/device.entity';
import { CommandLogEntity } from './entity/device-command.entity';
import { DeviceTelemetryEntity } from './entity/device-telemetry.entity';
import { LiquorKilnHandler } from './handlers/liquor-kiln.handler';
import { IoTCommandService } from './services/command.service';
import { IoTCommandV1Service } from './services/command-v1.service';
import { DeviceService } from './services/device.service';
import { DeviceRegistryService } from './services/device-registry.service';
import { DeviceTelemetryService } from './services/device-telemetry.service';

// import { UplinkController } from './uplink.controller';

@Module({
  imports: [
    DiscoveryModule,
    TypeOrmModule.forFeature([
      DeviceEntity,
      CommandLogEntity,
      DeviceTelemetryEntity,
    ]),
    BullModule.registerQueue({
      name: 'iot-commands',
    }),
    BullModule.registerQueue({
      name: QueueNameEnum.REDIS_QUEUE_IOT_V1,
    }),
  ],
  controllers: [
    IoTCommandController,
    IoTCommandV1Controller,
    DeviceTelemetryController,
  ],
  exports: [
    DeviceRegistryService,
    IoTCommandService,
    IoTCommandV1Service,
    CommandFactory,
    MqttService,
    DeviceService,
    DeviceTelemetryService,
    SocketService,
    JwtService,
  ],
  providers: [
    IoTCommandService,
    IoTCommandV1Service,
    CommandFactory,
    CommandProcessor,
    MqttService,
    DeviceService,
    DeviceRegistryService,
    LiquorKilnHandler,
    DeviceTelemetryService,
    SocketService,
    JwtService,
  ],
})
export class IotModule {}
