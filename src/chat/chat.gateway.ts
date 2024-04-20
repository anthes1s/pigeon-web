import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway {
  @WebSocketServer() server: Server;

  onModuleInit() {
    // Instantiate Event Listeners here:
    this.server.on('connection', (socket: Socket) => {
      // NOTE: Add connected users to the Map<string, Socket>() here
      // NOTE: Should I name it WSContainerService or UserWsService? 
      // TODO: FIND A GOOD NAME FOR A THINGIE THAT WILL KEEP CONNECTED USERS USERNAMES AND CORRESPONDING SOCKET
      console.log(socket.id, 'connected');
    });
  }

  @SubscribeMessage('message')
  onNewMessage(@MessageBody() body: any) {
    // TODO: Create new 'Message' Prisma schema
    // TODO: Create a Dto for WsMessage (WsMessageDto)
    // TODO: After message has been received, add it to the database
    // TODO: Check if the receiver of the message is online, if so, send (emit) him a message;
    // NOTE: To emit a message to a specific user I need to create a container class that would store a username and a socket (just a simple map) 
    // NOTE: (frontend-related) If receivers active chatroom is not with the sender, just show some notification about new message from sender
    //
    this.server.emit('fuck', 'server received your message, bruv');
    console.log(body);
  }
}
