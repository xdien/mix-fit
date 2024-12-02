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
  @ApiOperation({ summary: 'Gửi lệnh đến thiết bị IoT' })
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

  @Get(':commandId/status')
  @ApiOperation({ summary: 'Lấy trạng thái của lệnh' })
  @ApiParam({
    name: 'commandId',
    description: 'ID của lệnh cần kiểm tra',
    example: 'cmd-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Trạng thái hiện tại của lệnh',
    type: CommandStatusDto,
  })
  async getStatus(@Param('commandId') commandId: string) {
    return this.commandService.getCommandStatus(commandId);
  }
}
