import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

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
      throw new UnauthorizedException("Token is missing");
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.get('ACCESS_JWT_TOKEN'),
      });
      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException("Bad Token");
    }

    return true;
  }
}
