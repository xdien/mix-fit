import type { WebSocket } from 'ws';

export interface ISocketClient {
  id: string;
  token: string;
  lastHeartbeat: number;
  isAlive: boolean;
  ws: WebSocket;
}
