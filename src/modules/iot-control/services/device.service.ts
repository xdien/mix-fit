import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DeviceEntity } from '../entities/device.entity';

@Injectable()
export class DeviceService {
  private readonly logger = new Logger(DeviceService.name);

  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
  ) {
    this.logger.log('DeviceService created');
  }

  async findById(deviceId: string): Promise<DeviceEntity | null> {
    return this.deviceRepository.findOne({ where: { deviceId } });
  }

  // update online status
  async updateOnlineStatus(deviceId: string, online: boolean): Promise<void> {
    await this.deviceRepository.update({ deviceId }, { online });
  }
}
