import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { WsAuthGuard } from 'src/Shared/Guards/wsauth.guard';
import { UseGuards } from '@nestjs/common';
import { ISocket } from 'src/common/interfaces/global.interface';
import { HelperService } from 'src/Shared/Services/helper.service';

import { SocketService } from './socket.service';

@WebSocketGateway(8080, {
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection {
  constructor(
    private readonly _helperService: HelperService,
    private readonly _socketService: SocketService,
  ) {}
  @WebSocketServer()
  server: Server;
  socketClient: ISocket;
  private connectedClients: Map<string, string> = new Map();

  @UseGuards(WsAuthGuard)
  async handleConnection(@ConnectedSocket() client: ISocket) {
    const { data } = await this._helperService.validateSocketConnection(client);
    if (data?.user?.id) {
      for (const [userId] of this.connectedClients.entries()) {
        if (userId === data.user.id) {
          this.connectedClients.delete(userId);
        }
      }
      this.connectedClients.set(data?.user?.id, client.id);
    } else {
      client.disconnect();
    }
  }

  async handleDisconnect(client: ISocket) {
    const userId = Array.from(this.connectedClients.entries()).find(
      ([key, value]) => value === client.id,
    )?.[0];

    // if (userId) {
    //   this.connectedClients.delete(userId);
    //   console.log(
    //     `User  ${userId} with socket ID ${client.id} disconnected and removed from connected clients.`,
    //   );
    // } else {
    //   console.log(
    //     `Client with socket ID ${client.id} disconnected without a matching user.`,
    //   );
    // }
  }

  @SubscribeMessage('chat_message')
  async handleNewMessage(
    @MessageBody() { message, chatid }: { message: string; chatid: string },
    @ConnectedSocket() client: ISocket,
  ) {
    const socketid = client.id;
    const userid = Array.from(this.connectedClients.entries()).find(
      ([key, value]) => value === socketid,
    )?.[0];

    const data = await this._socketService.sendMessage({
      chatid,
      message,
      userid,
    });

    // Emit the message to all clients
    this.server.emit(`chat_message_${chatid}`, {
      message: message,
      timestamp: new Date().toISOString(),
    });
  }
}
