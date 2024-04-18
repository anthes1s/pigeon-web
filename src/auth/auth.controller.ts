import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { AuthGuard } from './guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  // Start writing a frontend to understand what you need to get from that route
  @UseGuards(AuthGuard)
  @Post('verify')
  verify() {}
}
