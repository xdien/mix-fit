import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { AuthWithDeviceOwner } from '../../../guards/auth-with-device-owner.guard';
import { CommandPayloadDto } from '../dto/command-payload.dto';
import { CommandStatusDto } from '../dto/command-status.dto';
import { IoTCommandService } from '../services/command.service';

@Controller('iot/v1/commands')
@ApiTags('IoT Commands')
export class IoTCommandController {
  //   private readonly _logger = new Logger(IoTCommandController.name);

  constructor(private readonly commandService: IoTCommandService) {}

  @Post(':deviceId')
  @AuthWithDeviceOwner()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Send command to device' })
  @ApiParam({
    name: 'deviceId',
    description: 'ID của thiết bị IoT',
    example: 'device-123',
  })
  @ApiBody({ type: CommandPayloadDto })
  @ApiCreatedResponse({
    description: 'Lệnh đã được gửi thành công',
    type: CommandStatusDto,
  })
  async sendCommand(
    @Param('deviceId') deviceId: string,
    @Body() payload: CommandPayloadDto,
  ) {
    return this.commandService.executeCommand(deviceId, payload);
  }
}
