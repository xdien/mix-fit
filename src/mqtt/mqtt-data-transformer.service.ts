import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

import { MqttDataDto } from './dtos/mqtt-data.dto';

@Injectable()
export class MqttDataTransformerService {
  async mapJsonToDto(json: unknown): Promise<MqttDataDto> {
    const dto = plainToInstance(MqttDataDto, json);
    await validateOrReject(dto);

    return dto;
  }
}
