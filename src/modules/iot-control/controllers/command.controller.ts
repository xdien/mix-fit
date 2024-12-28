import {
  Body,
  Controller,
  Get,
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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthWithDeviceOwner } from '../../../guards/auth-with-device-owner.guard';
import { CommandPayloadDto } from '../dto/command-payload.dto';
import { CommandStatusDto } from '../dto/command-status.dto';
import { IoTCommandService } from '../services/command.service';

@Controller('iot/commands')
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
    description: 'ID of the device',
    example: 'device-123',
  })
  @ApiBody({ type: CommandPayloadDto })
  @ApiCreatedResponse({
    description: 'Command sent successfully',
    type: CommandStatusDto,
  })
  async sendCommand(
    @Param('deviceId') deviceId: string,
    @Body() payload: CommandPayloadDto,
  ) {
    return this.commandService.executeCommand(deviceId, payload);
  }

  @Get(':commandId/status')
  //   @AuthWithDeviceOwner()
  @ApiOperation({ summary: 'Get status of command' })
  @ApiParam({
    name: 'commandId',
    description: 'ID of the command',
    example: 'cmd-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Status of the command',
    type: CommandStatusDto,
  })
  async getStatus(@Param('commandId') commandId: string) {
    return this.commandService.getCommandStatus(commandId);
  }
}
