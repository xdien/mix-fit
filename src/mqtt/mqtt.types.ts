export interface IMqttConfig {
  brokerUrl: string;
  username: string;
  password: string;
  clientId?: string;
  port?: number;
  protocol?: 'mqtt' | 'mqtts';
}

export interface IMqttCommandPayload {
  commandId: string;
  deviceType: string;
  timestamp: string;
  params?: {
    power?: boolean;
    temperature?: number;
    mode?: string;
    intensity?: number;
    [key: string]: unknown;
  };
}

export interface IMqttResponsePayload {
  commandId: string;
  status: 'success' | 'error';
  timestamp: string;
  error?: string;
  data?: Record<string, unknown>;
}

export type MqttMessageCallback = (
  topic: string,
  payload: IMqttCommandPayload | IMqttResponsePayload,
) => void | Promise<void>;
