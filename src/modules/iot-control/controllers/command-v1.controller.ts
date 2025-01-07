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
import { CommandPayloadDto } from '../dto/command-payload.dto';
import { CommandStatusDto } from '../dto/command-status.dto';
import { IoTCommandV1Service } from '../services/command-v1.service';

@Controller('/v1/iot/commands')
@ApiTags('IoT Commands')
export class IoTCommandControllerV1 {
  //   private readonly _logger = new Logger(IoTCommandController.name);

  constructor(private readonly commandService: IoTCommandV1Service) {}

  @Post(':deviceId')
  @AuthWithDeviceOwner()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Send command to device' })
  @ApiParam({
    name: 'deviceId',
    description: 'Id of device',
    example: 'device-123',
    required: true,
    schema: {
      type: 'string',
    },
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
