import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthdtoChangePass, AuthdtoSignIn, AuthdtoSignUp } from './dto';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    async SignUp(dto: AuthdtoSignUp){
        try{
            const hash = await argon2.hash(dto.password);
            const user= await this.prisma.user.create({
                data:{
                    name: dto.name,
                    email: dto.email,
                    hash
                }
            });
            delete user.hash;
            return "signed up!";
        }catch(error){
            if (
                error instanceof
                Prisma.PrismaClientKnownRequestError
            ) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException(
                        'Credential taken',
                    );
                }
            }
            throw error;
        }
    }

    async SignIn(dto: AuthdtoSignIn){
        const user = await this.prisma.user.findUnique({
            where:{
                email: dto.email
            }
        });
        if (!user){
            throw new ForbiddenException('User not found');
        }
        const verify= await argon2.verify(user.hash, dto.password);
        if (!verify){
            throw new ForbiddenException('Please check your password');
        }
        delete user.hash;
        return "signed in!";
    }

    async changePassword(dto: AuthdtoChangePass){
        const user = await this.prisma.user.findUnique({
            where:{
                email: dto.email
            }
        });
        if (!user){
            throw new ForbiddenException('User not found');
        }
        const verify= await argon2.verify(user.hash, dto.password);
        if (!verify){
            throw new ForbiddenException('Please check your password');
        }
        const hash = await argon2.hash(dto.newPassword);
        await this.prisma.user.update({
            where:{
                email: dto.email
            },
            data:{
                hash
            }
        });
    }
}
