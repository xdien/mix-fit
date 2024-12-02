import { applyDecorators, UseGuards } from '@nestjs/common';

import { RoleType } from '../constants';
import { Auth } from '../decorators';
import { DeviceOwnerGuard } from './device-owner.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

export function AuthWithDeviceOwner() {
  return applyDecorators(
    Auth([RoleType.USER]),
    UseGuards(JwtAuthGuard, DeviceOwnerGuard),
  );
}
