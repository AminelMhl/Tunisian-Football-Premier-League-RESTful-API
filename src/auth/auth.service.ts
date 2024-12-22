import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthdtoChangePass, AuthdtoSignIn, AuthdtoSignUp } from './dto';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { OAuth2Strategy } from 'passport-google-oauth';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    async SignUp(dto: AuthdtoSignUp) {
        try {
            const hash = await argon2.hash(dto.password);
            const user = await this.prisma.user.create({
                data: {
                    name: dto.name,
                    email: dto.email,
                    hash
                }
            });
            delete user.hash;
            return "signed up!";
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials taken');
                }
            }
            throw error;
        }
    }

    async SignIn(dto: AuthdtoSignIn) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        });

        if (!user) {
            throw new ForbiddenException('Credentials incorrect');
        }

        const pwMatches = await argon2.verify(user.hash, dto.password);

        if (!pwMatches) {
            throw new ForbiddenException('Credentials incorrect');
        }

        const token = await this.signToken(user.id, user.email);
        return { access_token: token };
    }

    async signToken(userId: number, email: string): Promise<string> {
        const payload = {
            sub: userId,
            email
        };

        return this.jwtService.signAsync(payload, {
            expiresIn: '15m',
            secret: this.configService.get('JWT_SECRET')
        });
    }

    async changePassword(dto: AuthdtoChangePass) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        });

        if (!user) {
            throw new ForbiddenException('User not found');
        }

        const pwMatches = await argon2.verify(user.hash, dto.oldPassword);

        if (!pwMatches) {
            throw new ForbiddenException('Old password incorrect');
        }

        const newHash = await argon2.hash(dto.newPassword);
        await this.prisma.user.update({
            where: {
                email: dto.email
            },
            data: {
                hash: newHash
            }
        });

        return "Password changed successfully!";
    }
}

// OAuth 2.0 Strategy
@Injectable()
export class GoogleStrategy extends PassportStrategy(OAuth2Strategy, 'google') {
    constructor(private prisma: PrismaService) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/auth/google/callback',
            scope: ['email', 'profile']
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
        const { name, emails } = profile;
        const user = await this.prisma.user.upsert({
            where: { email: emails[0].value },
            update: {},
            create: {
                email: emails[0].value,
                name: name.givenName + ' ' + name.familyName,
                hash: ''
            }
        });
        done(null, user);
    }
}