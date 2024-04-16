import { ForbiddenException, Injectable } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    async login(body: LoginDto) {
        // Check contents of body in a database!
        
        const user = await this.prisma.user.findUnique({
            where: {
                username: body.username,
            }
        });
        if(!user) throw new ForbiddenException("Invalid username/password");

        const match = await argon.verify(user.password, body.password);
        if(!match) throw new ForbiddenException("Invalid username/password");

        delete user.password;

        // return a jwt token later
        return { success: true, user};
    }

    async register(body: RegisterDto) {
        try {        
            const hash = await argon.hash(body.password);
            const user = await this.prisma.user.create({ 
                data: {
                    username: body.username,
                    password: hash
                }
            });

            console.log(await this.prisma.user.findMany());

            // return a jwt token later
            return user;
        } catch(error) {
            throw new ForbiddenException("User already exists");
        }
    }
}
