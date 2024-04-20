import { Controller, Get, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SearchDto, FavoritesDto } from './dto';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) { }

  @Get('search')
  search(@Query() query: SearchDto) {
    return this.chatService.search(query);
  }

  @Get('favorites')
  favorites(@Query() query: FavoritesDto) {
    return this.chatService.favorites(query);
  }
}
