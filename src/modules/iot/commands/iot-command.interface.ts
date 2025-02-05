import type { JobState } from 'bullmq';

export type CommandAction =
  | 'TOGGLE'
  | 'TURN_ON'
  | 'TURN_OFF'
  | 'SET_MAX_OIL_TEMP'
  | 'SET_STANDARD_OIL_TEMP'
  | 'SET_MAX_WATER_TEMP';

export interface ICommandPayload {
  deviceId: string;
  deviceType: string;
  parameters?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  repositoryType?: string;
}

export interface ICommandResponse {
  commandId: string;
  status: JobState | 'unknown';
  result?: unknown;
  executedAt?: Date;
  error?: string | undefined;
}
