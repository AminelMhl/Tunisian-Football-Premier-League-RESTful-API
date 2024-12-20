import { Body, Controller, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthdtoChangePass, AuthdtoSignIn, AuthdtoSignUp } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/signUp')
    async signUp(@Body() dto: AuthdtoSignUp){
        return this.authService.SignUp(dto);
    }

    @Post('/signIn')
    async signIn(@Body() dto: AuthdtoSignIn){
        return this.authService.SignIn(dto);
    }

    @Put('/password')
    async changePassword(@Body() dto: AuthdtoChangePass){
        return this.authService.changePassword(dto);
    }
}
