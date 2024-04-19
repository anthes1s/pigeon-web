import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SearchDto } from './dto/search.dto';

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) {}

    async search(dto: SearchDto) {
        let users = await this.prisma.user.findMany({
            where: {
                username: {
                    startsWith: dto.username
                }
            }
        });

        let sanitized: Array<string> = [];

        for(let user of users) {
           sanitized.push(user.username);
        };

        return sanitized;
    }
}
