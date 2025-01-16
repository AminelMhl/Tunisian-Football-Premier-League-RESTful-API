import { Injectable, ForbiddenException, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthdtoChangePass, AuthdtoSignIn, AuthdtoSignUp } from './dto';
import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { RefreshTokenDto } from './dto/refresh-token.dto';


@Injectable()
export class AuthService {
  private oauth2Client: any;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async SignUp(dto: AuthdtoSignUp) {
    try {
      const hash = await argon2.hash(dto.password);
      const verificationToken = uuidv4(); // Generate a unique token
      const refreshToken = await this.jwtService.signAsync({ email: dto.email }, {
        expiresIn: '7d', // Set a longer expiration for refresh token
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      const user = await this.prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          hash,
          verificationToken,
          refreshToken, // Store the refresh token
        },
      });

      // Send verification email
      await this.sendVerificationEmail(user.email, verificationToken);

      return {
        message: 'User successfully signed up. Please check your email for verification.',
        refreshToken, // Optionally return the refresh token
      };
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
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    if (!user.isVerified) {
      throw new ForbiddenException('Email not verified');
    }

    const pwMatches = await argon2.verify(user.hash, dto.password);

    if (!pwMatches) {
      throw new ForbiddenException('Credentials incorrect');
    }

    const accessToken = await this.signToken(user.id, user.email, user.role);

      user.refreshToken = await this.jwtService.signAsync({ sub: user.id }, {
        expiresIn: '7d', // Set a longer expiration for refresh token
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      // Update the user with the new refresh token
      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: user.refreshToken },
      });
    

    return { access_token: accessToken, refresh_token: user.refreshToken }; // Return both tokens
  }


  async signToken(userId: number, email: string, role: string): Promise<string> {
    const payload = { sub: userId, email, role };
    return this.jwtService.signAsync(payload, {
      expiresIn: '15m', // Set the expiration time for the access token
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }

  async changePassword(userId: number, dto: AuthdtoChangePass) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User  not found');
    }

    // Check if the old password matches the current password
    const pwMatches = await argon2.verify(user.hash, dto.oldPassword);
    if (!pwMatches) {
      throw new ForbiddenException('Old password incorrect');
    }

    // Check if the new password is the same as the old password
    const isSamePassword = await argon2.verify(user.hash, dto.newPassword);
    if (isSamePassword) {
      throw new ForbiddenException('New password cannot be the same as the old password');
    }

    // Hash the new password and update it
    const newHash = await argon2.hash(dto.newPassword);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hash: newHash,
      },
    });

    return "Password changed successfully!";
  }


  async googleLogin(req) {
    if (!req.user) {
      return 'No user from Google';
    }

    return {
      message: 'User information from Google',
      user: req.user,
    };
  }

  async sendVerificationEmail(email: string, token: string) {
    // Create a transporter using SMTP
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Use your email provider's SMTP server
      port: 587, // Port for TLS
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });

    // Email options
    const mailOptions = {
      from: 'TunisFootball@gmail.com',
      to: email,
      subject: 'Email Verification',
      text: `Please verify your email by clicking the link: http://localhost:3003/auth/verify?token=${token}`,
      html: `<h1>Email Verification</h1><p>Please verify your email by clicking the link below:</p><a href="http://localhost:3003/auth/verify?token=${token}">Verify Email</a>`, // HTML body
    };

    // Send email
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async refreshToken(body: RefreshTokenDto) {
    const { refreshToken } = body;

    // Check if refreshToken is provided
    if (!refreshToken || typeof refreshToken !== 'string') {
      throw new BadRequestException('Refresh token must be a string');
    }

    // Verify the refresh token
    let payload;
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check if the refresh token exists in the database
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub }, // Assuming the user ID is in the payload
    });

    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Generate new access token
    const newAccessToken = await this.signToken(payload.sub, payload.email, payload.role);

    // Generate new refresh token
    const newRefreshToken = await this.jwtService.signAsync({ sub: user.id }, {
      expiresIn: '7d', // Set a longer expiration for refresh token
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    // Update the user's refresh token in the database
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    return { access_token: newAccessToken, refresh_token: newRefreshToken };
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findUnique({
      where: { verificationToken: token },
    });

    if (!user) {
      throw new NotFoundException('Invalid verification token');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null, // Clear the token after verification
      },
    });

    return { message: 'Email verified successfully!' };
  }
}