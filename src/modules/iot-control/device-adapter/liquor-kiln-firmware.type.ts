export enum LiquorKilnCommandEnum {
  HEATER_1 = 0,
  HEATER_2 = 1,
  HEATER_3 = 2,
  SET_OVERHEAT_TEMP = 3,
  SET_COOLING_TEMP = 4,
  SET_DISTILLATION_TIME = 6,
  RESET_WIFI = 7,
  SET_DISTILLATION_DAY_TEMP_MIN = 8,
  SET_DISTILLATION_DAY_TEMP_MAX = 9,
  SET_DISTILLATION_NIGHT_TEMP_MIN = 10,
  SET_DISTILLATION_NIGHT_TEMP_MAX = 11,
  UPDATE_TIME_NTP = 12,
  SET_TOTAL_DAY_DISTILLATION_TIME,
  SET_TOTAL_NIGHT_DISTILLATION_TIME,
  CMD_HEATER_1,
  CMD_HEATER_2,
  CMD_HEATER_SYS,
  TURN_ON_DAY_DISTILLATION,
  TURN_ON_NIGHT_DISTILLATION,
  TURN_OFF_DISTILLATION,
  CMD_POWER_PUMP_WATER,
}
