import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtModule } from '@nestjs/jwt';
import { ChatGateway } from './chat.gateway';
import { UserContainerModule } from './user-container/user-container.module';

@Module({
  imports: [JwtModule, UserContainerModule],
  providers: [ChatService, ChatGateway],
  controllers: [],
})
export class ChatModule {}
