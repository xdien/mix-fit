import { applyDecorators, UseGuards } from '@nestjs/common';

import { UserRoleEnum } from '../constants';
import { Auth } from '../decorators';
import { DeviceOwnerGuard } from './device-owner.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

export function AuthWithDeviceOwner() {
  return applyDecorators(
    Auth([UserRoleEnum.USER]),
    UseGuards(JwtAuthGuard, DeviceOwnerGuard),
  );
}
