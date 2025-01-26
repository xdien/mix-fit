import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { DeviceDto } from 'modules/iot-control/dto/device.dto';

import { RoleType } from '../../../constants';
import { Auth, AuthUser } from '../../../decorators';
import { UserEntity } from '../../user/user.entity';
import { DeviceService } from '../services/device.service';

@Controller('"devices"')
@ApiTags('IoT')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get()
  @Auth([RoleType.USER])
  @ApiOperation({ summary: 'Get all devices' })
  getDevices(@AuthUser() user: UserEntity): Promise<DeviceDto[]> {
    return this.deviceService.getUserDevices(user.id);
  }
}
