import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { AddDeviceDto } from '../dto/add-device.dto';
import type { DeviceDto } from '../dto/device.dto';
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

  async getUserDevices(userId: Uuid): Promise<DeviceDto[]> {
    const devices = await this.deviceRepository.find({
      where: { owner: { id: userId } },
    });

    return devices.map((device) => device.toDto());
  }

  async addDevice(
    userId: string,
    addDeviceDto: AddDeviceDto,
  ): Promise<DeviceDto> {
    // Check if device already exists
    const existingDevice = await this.deviceRepository.findOne({
      where: { deviceId: addDeviceDto.deviceId },
    });

    if (existingDevice) {
      throw new ConflictException('Device already registered');
    }

    // Create new device
    const device = this.deviceRepository.create({
      ...addDeviceDto,
      owner: { id: userId },
    });

    const savedDevice = await this.deviceRepository.save(device);

    return savedDevice.toDto();
  }
}
