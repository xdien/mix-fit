import { ApiProperty } from '@nestjs/swagger';

export class CommandStatusDto {
  @ApiProperty({
    description: 'ID của lệnh',
    example: 'cmd-123',
  })
  commandId: string | undefined;

  @ApiProperty({
    description: 'Trạng thái của lệnh',
    enum: ['PENDING', 'EXECUTING', 'COMPLETED', 'FAILED'],
    example: 'COMPLETED',
  })
  status: string | undefined;

  @ApiProperty({
    description: 'Thời gian thực thi',
    example: '2024-03-15T10:30:00Z',
  })
  executedAt: Date | undefined;
}
