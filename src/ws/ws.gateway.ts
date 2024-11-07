import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import io from 'socket.io';

@WebSocketGateway()
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server: io.Server;

  public clients = new Map<unknown, io.Socket>();

  private getClientQuery(client: io.Socket): Record<string, unknown> {
    return client.handshake.query;
  }

  public broadcastAll(event_name: string, message: Record<string, unknown>) {
    this.server.emit(event_name, message);
  }

  public async handleConnection(client: io.Socket) {
    const { user_id } = this.getClientQuery(client);

    this.clients.set(user_id, client);

    return this.broadcastAll('event', { connected: user_id });
  }

  public async handleDisconnect(client: io.Socket) {
    const { user_id } = this.getClientQuery(client);

    this.clients.delete(user_id);

    return this.broadcastAll('event', { disconnected: user_id });
  }
}
