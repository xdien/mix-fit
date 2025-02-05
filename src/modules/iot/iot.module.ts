import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QueueNameEnum } from '../../constants/queue-key';
import { MqttService } from '../../mqtt/mqtt.service';
import { CommandFactory } from './commands/command.factory';
import { CommandProcessor } from './commands/command-v1.processor';
import { IoTCommandController } from './controllers/command.controller';
import { IoTCommandV1Controller } from './controllers/command-v1.controller';
import { DeviceEntity } from './entity/device.entity';
import { CommandLogEntity } from './entity/device-command.entity';
import { LiquorKilnHandler } from './handlers/liquor-kiln.handler';
import { IoTCommandService } from './services/command.service';
import { IoTCommandV1Service } from './services/command-v1.service';
import { DeviceService } from './services/device.service';
import { DeviceRegistryService } from './services/device-registry.service';

// import { UplinkController } from './uplink.controller';

@Module({
  imports: [
    DiscoveryModule,
    TypeOrmModule.forFeature([DeviceEntity, CommandLogEntity]),
    BullModule.registerQueue({
      name: 'iot-commands',
    }),
    BullModule.registerQueue({
      name: QueueNameEnum.REDIS_QUEUE_IOT_V1,
    }),
  ],
  controllers: [IoTCommandController, IoTCommandV1Controller],
  exports: [
    IoTCommandService,
    IoTCommandV1Service,
    CommandFactory,
    MqttService,
    DeviceService,
    DeviceRegistryService,
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
  ],
})
export class IotModule {}
