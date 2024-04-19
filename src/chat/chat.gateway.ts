import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server } from 'socket.io';

@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway {
  @WebSocketServer() server: Server;

  onModuleInit() {
    // Instantiate Event Listeners here:
    this.server.on('connection', (socket) => {
      console.log(socket.id, 'connected');
    });
  }

  @SubscribeMessage('message')
  onNewMessage(@MessageBody() body: any) {
    this.server.emit('fuck', 'server received your message, bruv');
    console.log(body);
  }
}
