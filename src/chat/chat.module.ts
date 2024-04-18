import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { JwtModule } from '@nestjs/jwt';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [JwtModule],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
