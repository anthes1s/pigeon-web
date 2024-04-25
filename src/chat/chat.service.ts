import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchDto, FavoritesDto, MessageDto } from './dto';
import { UserContainerService } from './user-container/user-container.service';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private userContainerService: UserContainerService,
  ) {}

  async search(dto: SearchDto) {
    const users = await this.prisma.user.findMany({
      where: {
        username: {
          startsWith: dto.username,
        },
      },
    });

    const sanitized: Array<string> = [];

    for (const user of users) {
      sanitized.push(user.username);
    }

    return sanitized;
  }

  async favorites(dto: FavoritesDto) {
    // TODO: Return existing chatrooms for a username
    const receivers = await this.prisma.message.groupBy({
      where: {
        sender: dto.username,
      },
      by: ['receiver'],
    });

    const sanitized: Array<string> = [];

    for (const user of receivers) {
      sanitized.push(user.receiver);
    }

    return sanitized;
  }

  async messageHistory(dto: MessageDto) {
    console.log(dto);
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [
          { sender: dto.sender, receiver: dto.receiver },
          { sender: dto.receiver, receiver: dto.sender },
        ],
      },
    });

    console.log('msghistory', messages);
    return messages;
  }

  async messageNew(dto: MessageDto) {
    if (dto.receiver === 'null') throw new Error('Receiver is not selected');
    const message = await this.prisma.message.create({
      data: {
        timestamp: new Date(dto.timestamp),
        sender: dto.sender,
        receiver: dto.receiver,
        message: dto.message,
      },
    });

    const receiverSocket = this.userContainerService.getUser(message.receiver);
    if (receiverSocket)
      receiverSocket.emit('new-message', {
        timestamp: message.timestamp,
        sender: message.sender,
        message: message.message,
      });

    return {
      timestamp: message.timestamp,
      sender: message.sender,
      message: message.message,
    };
  }
}
