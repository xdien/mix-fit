import { Controller, Logger } from '@nestjs/common';

import { MqttService } from './mqtt.service';

@Controller('mqtt')
export class MqttController {
  private readonly logger = new Logger(MqttController.name);

  constructor(private readonly mqttService: MqttService) {
    this.logger.debug('DeviceDataController initialized', this.mqttService);
  }
}
