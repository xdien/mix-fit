import { Module } from '@nestjs/common';

import { IotControlModule } from '../../modules/iot-control/iot-control.module';
import { DeviceController } from '../iot-control/controllers/device.controller';

// import { UplinkController } from './uplink.controller';

@Module({
  imports: [IotControlModule],
  controllers: [DeviceController],
})
export class IotModule {}
