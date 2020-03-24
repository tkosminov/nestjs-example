import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import config from 'config';
import io from 'socket.io';

import { LoggerService } from '../logger/logger.service';

import { IClientQuery } from './socket.interface';

const appSettings = config.get<IAppSettings>('APP_SETTINGS');

@WebSocketGateway(appSettings.socketPort)
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server: io.Server;

  constructor(private readonly logger: LoggerService) {}

  private getClientQuery(client: io.Socket): IClientQuery {
    return client.handshake.query as IClientQuery;
  }

  public async handleConnection(client: io.Socket) {
    const { user_id } = this.getClientQuery(client);

    this.logger.info(`${user_id} - handleConnection`);

    return this.server.emit('event', { connected: user_id });
  }

  public async handleDisconnect(client: io.Socket) {
    const { user_id } = this.getClientQuery(client);

    this.logger.info(`${user_id} - handleDisconnect`);

    return this.server.emit('event', { disconnected: user_id });
  }
}
