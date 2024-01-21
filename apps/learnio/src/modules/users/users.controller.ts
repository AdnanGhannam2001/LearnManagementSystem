import { Body, Controller, Get, HttpCode, HttpStatus, Post, Redirect, Render, Req, Res } from "@nestjs/common";
import { UsersService } from "./users.service";
import { Login } from "./decorator/login.decorator";
import { Request, Response } from "express";
import { RegisterRequestDto } from "./dto/register.request";
import { VerifyEmailRequestDto } from "./dto/verify-email.request";

@Controller('users')
export class UsersController {
    constructor(private readonly service: UsersService) { }

    @Get('register')
    @Render('pages/register')
    getRegister() { }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('register')
    @Redirect('/users/verify-email', 301)
    register(@Body() dto: RegisterRequestDto) {
        return this.service.register(dto);
    }

    @Get('verify-email')
    @Render('pages/verify-email')
    getVerifyEmail() { }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Redirect('/users/login', 301)
    @Post('verify-email')
    verifyEmail(@Body() dto: VerifyEmailRequestDto) {
        return this.verifyEmail(dto);
    }

    @Get('login')
    @Render('pages/login')
    getLogin() { }

    @HttpCode(HttpStatus.OK)
    @Redirect('/', 301)
    @Post('login')
    @Login()
    login(@Req() req: Request, @Res() res: Response) {
        res.cookie('jwt', req.user, {
                httpOnly: false,
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 3, // 3h
            });
    }
}