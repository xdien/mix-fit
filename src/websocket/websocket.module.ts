import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { WsAuthGuard } from '../guards/ws-auth.guard';
import { WebsocketGateway } from './websocket.gateway';
import { WebsocketService } from './websocket.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [WebsocketGateway, WebsocketService, WsAuthGuard],
  exports: [WebsocketService],
})
export class WebsocketModule {}
