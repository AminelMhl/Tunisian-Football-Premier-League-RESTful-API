import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Authdto } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/signUp')
    async signUp(@Body() dto: Authdto){
        return this.authService.SignUp(dto);
    }

    @Post('/signIn')
    async signIn(@Body() dto: Authdto){
        return this.authService.SignIn(dto);
    }
}
