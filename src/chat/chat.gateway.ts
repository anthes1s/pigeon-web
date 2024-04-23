import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

import { Socket } from 'socket.io';
import { FavoritesDto, MessageDto, SearchDto } from './dto';
import { ChatService } from './chat.service';
import { UserContainerService } from './user-container/user-container.service';

@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private chatService: ChatService,
    private userContainerService: UserContainerService,
  ) {}

  handleConnection(@ConnectedSocket() client: Socket) {
    const username = client.handshake.query.username.toString();
    this.userContainerService.addUser(username, client);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.userContainerService.deleteUser(client);
  }

  @SubscribeMessage('new-message')
  async messageNew(@MessageBody() body: MessageDto) {
    return await this.chatService.messageNew(body);
  }

  @SubscribeMessage('message-history')
  async messageHistory(
    @MessageBody() body: MessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    client.emit('message-history', await this.chatService.messageHistory(body));
  }

  @SubscribeMessage('favorites')
  async favorites(
    @MessageBody() body: FavoritesDto,
    @ConnectedSocket() client: Socket,
  ) {
    client.emit('favorites', await this.chatService.favorites(body));
  }

  @SubscribeMessage('search')
  async search(
    @MessageBody() body: SearchDto,
    @ConnectedSocket() client: Socket,
  ) {
    client.emit('search', await this.chatService.search(body));
  }
}
