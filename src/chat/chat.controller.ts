import { Controller, Get, Param, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SearchDto } from './dto/search.dto';

@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService) {}

    @Get('search')
    search(@Query() query: SearchDto) {
        return this.chatService.search(query);
    }
}
