import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QueueNameEnum } from '../../constants/queue-key';
import { MqttService } from '../../mqtt/mqtt.service';
import { CommandFactory } from './commands/command.factory';
import { CommandProcessor } from './commands/command-v1.processor';
import { IoTCommandController } from './controllers/command.controller';
import { IoTCommandV1Controller } from './controllers/command-v1.controller';
import { DeviceEntity } from './entity/device.entity';
import { CommandLogEntity } from './entity/device-command.entity';
import { IoTCommandService } from './services/command.service';
import { IoTCommandV1Service } from './services/command-v1.service';
import { DeviceService } from './services/device.service';

// import { UplinkController } from './uplink.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeviceEntity, CommandLogEntity]),
    BullModule.registerQueue({
      name: 'iot-commands',
    }),
    BullModule.registerQueue({
      name: QueueNameEnum.REDIS_QUEUE_IOT_V1 as string,
    }),
  ],
  controllers: [IoTCommandController, IoTCommandV1Controller],
  exports: [
    IoTCommandService,
    IoTCommandV1Service,
    CommandFactory,
    MqttService,
    DeviceService,
  ],
  providers: [
    IoTCommandService,
    IoTCommandV1Service,
    CommandFactory,
    CommandProcessor,
    MqttService,
    DeviceService,
  ],
})
export class IotModule {}
