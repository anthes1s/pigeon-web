import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        JwtModule.registerAsync({
            useFactory: async (config: ConfigService) => ({
                secret: config.get('ACCESS_JWT_TOKEN'),
                signOptions: { expiresIn: '60s' },
            }),
            inject: [ConfigService]
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
