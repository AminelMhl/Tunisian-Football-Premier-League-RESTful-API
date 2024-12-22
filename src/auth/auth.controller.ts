import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthdtoSignIn, AuthdtoSignUp, AuthdtoChangePass } from './dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({ status: 201, description: 'User successfully signed up.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async signUp(@Body() dto: AuthdtoSignUp) {
    return this.authService.SignUp(dto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Sign in a user' })
  @ApiResponse({ status: 200, description: 'User successfully signed in.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async signIn(@Body() dto: AuthdtoSignIn) {
    return this.authService.SignIn(dto);
  }

  @Post('change-password')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password successfully changed.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async changePassword(@Body() dto: AuthdtoChangePass) {
    return this.authService.changePassword(dto);
  }
}