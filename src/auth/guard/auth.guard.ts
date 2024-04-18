import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    const token = request.body.jwt;
    console.log('Token - ', token);

    if (!token) {
      console.log('User was rejected - Missing a token');
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.get('ACCESS_JWT_TOKEN'),
      });
      request['user'] = payload;
    } catch (error) {
      console.log('User was rejected - Bad Token');
      throw new UnauthorizedException();
    }

    return true;
  }
}
