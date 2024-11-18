import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MqttService } from '../../mqtt/mqtt.service';
import { CommandFactory } from './commands/command.factory';
import { CommandProcessor } from './commands/command.processor';
import { IoTCommandController } from './controllers/command.controller';
import { DeviceEntity } from './entities/device.entity';
import { CommandLogEntity } from './entities/device-command.entity';
import { IotControlController } from './iot-control.controller';
import { IotControlService } from './iot-control.service';
import { IoTCommandService } from './services/command.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeviceEntity, CommandLogEntity]),
    BullModule.registerQueue({
      name: 'iot-commands',
    }),
  ],
  controllers: [IotControlController, IoTCommandController],
  exports: [IotControlService, IoTCommandService, CommandFactory, MqttService],
  providers: [
    IotControlService,
    IoTCommandService,
    CommandFactory,
    CommandProcessor,
    MqttService,
  ],
})
export class IotControlModule {}
