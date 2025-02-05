import { ApiProperty } from '@nestjs/swagger';

export class CommandParametersDto {
  @ApiProperty({
    description: 'Control heater 1',
    example: true,
    required: false,
    type: 'boolean',
  })
  HEATER_1?: boolean;

  @ApiProperty({
    description: 'Control heater 2',
    example: false,
    required: false,
    type: 'boolean',
  })
  HEATER_2?: boolean;

  @ApiProperty({
    description: 'Control heater 3',
    example: true,
    required: false,
    type: 'boolean',
  })
  HEATER_3?: boolean;

  @ApiProperty({
    description: 'Set overheat temperature threshold',
    example: 85.5,
    required: false,
    type: 'number',
  })
  SET_OVERHEAT_TEMP?: number;

  @ApiProperty({
    description: 'Set cooling temperature threshold',
    example: 25.5,
    required: false,
    type: 'number',
  })
  SET_COOLING_TEMP?: number;

  @ApiProperty({
    description: 'Set distillation time in minutes',
    example: 120,
    required: false,
    type: 'number',
  })
  SET_DISTILLATION_TIME?: number;

  @ApiProperty({
    description: 'Reset WiFi configuration',
    example: true,
    required: false,
    type: 'boolean',
  })
  RESET_WIFI?: boolean;

  @ApiProperty({
    description: 'Set minimum temperature for day distillation',
    example: 65.5,
    required: false,
    type: 'number',
  })
  SET_DISTILLATION_DAY_TEMP_MIN?: number;

  @ApiProperty({
    description: 'Set maximum temperature for day distillation',
    example: 75.5,
    required: false,
    type: 'number',
  })
  SET_DISTILLATION_DAY_TEMP_MAX?: number;

  @ApiProperty({
    description: 'Set minimum temperature for night distillation',
    example: 60.5,
    required: false,
    type: 'number',
  })
  SET_DISTILLATION_NIGHT_TEMP_MIN?: number;

  @ApiProperty({
    description: 'Set maximum temperature for night distillation',
    example: 70.5,
    required: false,
    type: 'number',
  })
  SET_DISTILLATION_NIGHT_TEMP_MAX?: number;

  @ApiProperty({
    description: 'Update system time using NTP',
    example: true,
    required: false,
    type: 'boolean',
  })
  UPDATE_TIME_NTP?: boolean;

  @ApiProperty({
    description: 'Set total distillation time for day operation in minutes',
    example: 480,
    required: false,
    type: 'number',
  })
  SET_TOTAL_DAY_DISTILLATION_TIME?: number;

  @ApiProperty({
    description: 'Set total distillation time for night operation in minutes',
    example: 360,
    required: false,
    type: 'number',
  })
  SET_TOTAL_NIGHT_DISTILLATION_TIME?: number;

  @ApiProperty({
    description: 'Control heater 1 power',
    example: true,
    required: false,
    type: 'boolean',
  })
  CMD_HEATER_1?: boolean;

  @ApiProperty({
    description: 'Control heater 2 power',
    example: false,
    required: false,
    type: 'boolean',
  })
  CMD_HEATER_2?: boolean;

  @ApiProperty({
    description: 'Control heater system power',
    example: true,
    required: false,
    type: 'boolean',
  })
  CMD_HEATER_SYS?: boolean;

  @ApiProperty({
    description: 'Enable day distillation mode',
    example: true,
    required: false,
    type: 'boolean',
  })
  TURN_ON_DAY_DISTILLATION?: boolean;

  @ApiProperty({
    description: 'Enable night distillation mode',
    example: true,
    required: false,
    type: 'boolean',
  })
  TURN_ON_NIGHT_DISTILLATION?: boolean;

  @ApiProperty({
    description: 'Disable distillation process',
    example: true,
    required: false,
    type: 'boolean',
  })
  TURN_OFF_DISTILLATION?: boolean;

  @ApiProperty({
    description: 'Control water pump power',
    example: false,
    required: false,
    type: 'boolean',
  })
  CMD_POWER_PUMP_WATER?: boolean;
}
