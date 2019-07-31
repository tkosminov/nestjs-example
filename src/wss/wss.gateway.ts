import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';

import { Socket } from 'dgram';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import ws from 'ws';

import { LoggerService } from '../common/logger/logger.service';

// tslint:disable-next-line: no-unsafe-any
@WebSocketGateway(8081)
export class WssGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server: ws.Server;

  constructor(private readonly logger: LoggerService) {}

  public handleConnection(_client: Socket) {
    this.logger.log('Connected');
  }

  public handleDisconnect(_client: Socket) {
    this.logger.log('Disconnected');
  }

  @SubscribeMessage('events')
  public onEvent(_client: Socket): Observable<WsResponse<number>> {
    const event = 'events';
    const response = [1, 2, 3];

    return from(response).pipe(map(data => ({ event, data })));
  }

  @SubscribeMessage('identity')
  public onIdentity(_client: Socket, data: number): WsResponse<number> {
    const event = 'identity';

    return { event, data };
  }
}
