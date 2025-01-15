import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { WsAuthGuard } from '../guards/ws-auth.guard';
import { ApiConfigService } from '../shared/services/api-config.service';
import { WebsocketGateway } from './websocket.gateway';
import { WebsocketService } from './websocket.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ApiConfigService) => ({
        privateKey: configService.authConfig.privateKey,
        publicKey: configService.authConfig.publicKey,
        signOptions: {
          algorithm: 'RS256',
          //     expiresIn: configService.getNumber('JWT_EXPIRATION_TIME'),
        },
        verifyOptions: {
          algorithms: ['RS256'],
        },
        // if you want to use token with expiration date
        // signOptions: {
        //     expiresIn: configService.getNumber('JWT_EXPIRATION_TIME'),
        // },
      }),
      inject: [ApiConfigService],
    }),
  ],
  providers: [WebsocketGateway, WebsocketService, WsAuthGuard],
  exports: [WebsocketService],
})
export class WebsocketModule {}
