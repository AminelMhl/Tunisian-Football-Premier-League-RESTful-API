import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService, private prisma: PrismaService, private authService: AuthService, private jwtService: JwtService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: 'http://localhost:3003/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails } = profile;
    const user = await this.prisma.user.upsert({
      where: { email: emails[0].value },
      update: {},
      create: {
        email: emails[0].value,
        name: name.givenName + ' ' + name.familyName,
        hash: '',
        isVerified: true,
      },
    });

    const token = await this.authService.signToken(user.id, user.email, user.role);
    const newRefreshToken = await this.jwtService.signAsync({ sub: user.id }, {
      expiresIn: '7d',
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    // Update the user with the new refresh token
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    // Return user and tokens
    done(null, { user, token, refreshToken: newRefreshToken });

  }
}