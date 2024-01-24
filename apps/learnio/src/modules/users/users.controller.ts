import { Controller, Get, Render } from "@nestjs/common";
import { Authenticate } from "../auth/decorator/authenticate.decorator";

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

    @Get()
    @Render('pages/users')
    @Authenticate()
    getUsers() { }
}