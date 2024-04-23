import { ForbiddenException, Injectable } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(body: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: body.username,
      },
    });
    if (!user) throw new ForbiddenException('Invalid username/password');

    const match = await argon.verify(user.password, body.password);
    if (!match) throw new ForbiddenException('Invalid username/password');

    const payload = { userId: user.id, username: user.username };

    return {
      username: user.username,
      jwt: await this.jwt.signAsync(payload),
      success: true,
    };
  }

  async register(body: RegisterDto) {
    try {
      const hash = await argon.hash(body.password);
      const user = await this.prisma.user.create({
        data: {
          username: body.username,
          password: hash,
        },
      });

      const payload = { userId: user.id, username: user.username };
      return {
        username: user.username,
        jwt: await this.jwt.signAsync(payload),
        success: true,
      };
    } catch (error) {
      console.log(error);
      throw new ForbiddenException('User already exists');
    }
  }

  async verify() {
    // NOTE: The method just has to go through the guard...
    return { success: true };
  }
}
