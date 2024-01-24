import { Controller, Get, Render } from "@nestjs/common";

@Controller('users')
export class UsersController {
    @Get('register')
    @Render('pages/register')
    register() { }

    @Get('verify-email')
    @Render('pages/verify-email')
    verifyEmail() { }

    @Get('login')
    @Render('pages/login')
    login() { }
}