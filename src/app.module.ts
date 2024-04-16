import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path'
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule, 
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'pigeon-client') }), 
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true })
],
})
export class AppModule {}
