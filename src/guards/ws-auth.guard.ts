import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';

import { SocketService } from '../websocket/websocket.service';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private readonly websocketService: SocketService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient();
    const token = this.extractToken(client); // Implement based on your token storage strategy

    try {
      return this.websocketService.authenticateClient(token).then(() => true);
    } catch {
      return false;
    }
  }

  private extractToken(_client: unknown): string {
    // Implement token extraction logic
    throw new Error('Method not implemented');
  }
}
