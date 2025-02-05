import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { AuthWithDeviceOwner } from '../../../guards/auth-with-device-owner.guard';
import { CommandPayloadDto } from '../dtos/command-payload.dto';
import { CommandStatusDto } from '../dtos/command-status.dto';
import { IoTCommandV1Service } from '../services/command-v1.service';

@Controller('/v1/iot/commands')
@ApiTags('IoT Commands')
export class IoTCommandV1Controller {
  //   private readonly _logger = new Logger(IoTCommandController.name);

  constructor(private readonly commandService: IoTCommandV1Service) {}

  @Post(':deviceId')
  @AuthWithDeviceOwner()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Send command to device' })
  @ApiParam({
    name: 'deviceId',
    required: true,
    description: 'ID of the device',
    example: 'device-123',
    type: String,
  })
  @ApiCreatedResponse({
    description: 'Command has been sent successfully',
    type: CommandStatusDto,
  })
  async sendCommand(
    @Param('deviceId') deviceId: string,
    @Body() payload: CommandPayloadDto,
  ) {
    return this.commandService.executeCommand(deviceId, payload);
  }
}
