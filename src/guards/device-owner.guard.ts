import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

import { RoleType } from '../constants';
import { DeviceService } from '../modules/iot-control/services/device.service';

@Injectable()
export class DeviceOwnerGuard implements CanActivate {
  constructor(private deviceService: DeviceService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      params: { deviceId: string };
      user: { roles: RoleType[]; id: string };
    }>();
    const user = request.user;
    const deviceId = request.params.deviceId;

    if (
      user.roles.includes(RoleType.SUPER_ADMIN) ||
      user.roles.includes(RoleType.IOT_ADMIN)
    ) {
      return true;
    }

    const device = await this.deviceService.findById(deviceId);

    return device?.owner.id === user.id;
  }
}
