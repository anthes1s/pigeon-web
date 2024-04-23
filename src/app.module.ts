import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    AuthModule,
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'client') }),
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ChatModule,
  ],
})
export class AppModule {}
