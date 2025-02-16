import { LiquorKilnCommandEnum } from './liquor-kiln-firmware.type';

export const ACTION_MAPPING = {
  HEATER_1: LiquorKilnCommandEnum.HEATER_1,
  HEATER_2: LiquorKilnCommandEnum.HEATER_2,
  HEATER_3: LiquorKilnCommandEnum.HEATER_3,
  SET_OVERHEAT_TEMP: LiquorKilnCommandEnum.SET_OVERHEAT_TEMP,
  SET_COOLING_TEMP: LiquorKilnCommandEnum.SET_COOLING_TEMP,
  SET_DISTILLATION_TIME: LiquorKilnCommandEnum.SET_DISTILLATION_TIME,
  RESET_WIFI: LiquorKilnCommandEnum.RESET_WIFI,
  SET_DISTILLATION_DAY_TEMP_MIN:
    LiquorKilnCommandEnum.SET_DISTILLATION_DAY_TEMP_MIN,
  SET_DISTILLATION_DAY_TEMP_MAX:
    LiquorKilnCommandEnum.SET_DISTILLATION_DAY_TEMP_MAX,
  SET_DISTILLATION_NIGHT_TEMP_MIN:
    LiquorKilnCommandEnum.SET_DISTILLATION_NIGHT_TEMP_MIN,
  SET_DISTILLATION_NIGHT_TEMP_MAX:
    LiquorKilnCommandEnum.SET_DISTILLATION_NIGHT_TEMP_MAX,
  UPDATE_TIME_NTP: LiquorKilnCommandEnum.UPDATE_TIME_NTP,
  SET_TOTAL_DAY_DISTILLATION_TIME:
    LiquorKilnCommandEnum.SET_TOTAL_DAY_DISTILLATION_TIME,
  SET_TOTAL_NIGHT_DISTILLATION_TIME:
    LiquorKilnCommandEnum.SET_TOTAL_NIGHT_DISTILLATION_TIME,
  CMD_HEATER_1: LiquorKilnCommandEnum.CMD_HEATER_1,
  CMD_HEATER_2: LiquorKilnCommandEnum.CMD_HEATER_2,
  CMD_HEATER_SYS: LiquorKilnCommandEnum.CMD_HEATER_SYS,
  TURN_ON_DAY_DISTILLATION: LiquorKilnCommandEnum.TURN_ON_DAY_DISTILLATION,
  TURN_ON_NIGHT_DISTILLATION: LiquorKilnCommandEnum.TURN_ON_NIGHT_DISTILLATION,
  TURN_OFF_DISTILLATION: LiquorKilnCommandEnum.TURN_OFF_DISTILLATION,
  CMD_POWER_PUMP_WATER: LiquorKilnCommandEnum.CMD_POWER_PUMP_WATER,
} as const;
