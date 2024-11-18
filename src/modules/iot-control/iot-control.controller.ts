import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

// import { IotControlService } from './iot-control.service';

@Controller('iot-control')
export class IotControlController {
  private readonly logger = new Logger(IotControlController.name);

  //   constructor(private readonly iotControlService: IotControlService) {}

  @EventPattern('iot-control/devied/+/status')
  handleIotControlStatus(data: unknown) {
    this.logger.log('handleIotControlStatus', data);
  }
}
