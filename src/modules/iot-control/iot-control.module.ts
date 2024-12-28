import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MqttService } from '../../mqtt/mqtt.service';
import { CommandFactory } from './commands/command.factory';
import { CommandProcessor } from './commands/command.processor';
import { IoTCommandController } from './controllers/command.controller';
import { IoTCommandControllerV1 } from './controllers/command-v1.controller';
import { DeviceEntity } from './entities/device.entity';
import { CommandLogEntity } from './entities/device-command.entity';
import { IotControlController } from './iot-control.controller';
import { IotControlService } from './iot-control.service';
import { IoTCommandService } from './services/command.service';
import { IoTCommandV1Service } from './services/command-v1.service';
import { DeviceService } from './services/device.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeviceEntity, CommandLogEntity]),
    BullModule.registerQueue({
      name: 'iot-commands',
    }),
  ],
  controllers: [
    IotControlController,
    IoTCommandController,
    IoTCommandControllerV1,
  ],
  exports: [
    IotControlService,
    IoTCommandService,
    IoTCommandV1Service,
    CommandFactory,
    MqttService,
    DeviceService,
  ],
  providers: [
    IotControlService,
    IoTCommandService,
    IoTCommandV1Service,
    CommandFactory,
    CommandProcessor,
    MqttService,
    DeviceService,
  ],
})
export class IotControlModule {}
