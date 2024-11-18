import { Module } from '@nestjs/common';

import { UplinkController } from './uplink.controller';

@Module({
  controllers: [UplinkController],
})
export class IotModule {}
