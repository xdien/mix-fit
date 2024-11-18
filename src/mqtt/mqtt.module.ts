import { Module } from '@nestjs/common';

import { MqttController } from './mqtt.controller';
import { MqttService } from './mqtt.service';
import { MqttDataTransformerService } from './mqtt-data-transformer.service';

@Module({
  providers: [MqttService, MqttDataTransformerService],
  controllers: [MqttController],
})
export class MqttModule {}
