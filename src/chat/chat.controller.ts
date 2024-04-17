import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard';

@UseGuards(AuthGuard)
@Controller('chat')
export class ChatController {
    
    @Get()
    chat() {}
    
}
