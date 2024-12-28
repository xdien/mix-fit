import type { CanActivate } from '@nestjs/common';
import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { RoleType } from '../constants';
import { DeviceService } from '../modules/iot-control/services/device.service';

@Injectable()
export class DeviceOwnerGuard implements CanActivate {
  private readonly logger = new Logger(DeviceOwnerGuard.name);

  constructor(private deviceService: DeviceService) {}

  @UseGuards(AuthGuard())
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      params: { deviceId: string };
      user: { roles: RoleType[]; id: string } | undefined;
    }>();
    this.logger.debug('UserId in', request.user?.id);
    const user = request.user;

    if (user === undefined) {
      throw new UnauthorizedException('User not authenticated');
    }

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
