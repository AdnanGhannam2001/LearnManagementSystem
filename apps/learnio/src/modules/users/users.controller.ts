import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res } from "@nestjs/common";
import { UsersService } from "./users.service";
import { Login } from "./decorator/login.decorator";
import { Request, Response } from "express";
import { RegisterRequestDto } from "./dto/register.request";
import { VerifyEmailRequestDto } from "./dto/verify-email.request";

@Controller('users')
export class UsersController {
    constructor(private readonly service: UsersService) { }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('register')
    register(@Body() dto: RegisterRequestDto) {
        return this.service.register(dto);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('verify-email')
    verifyEmail(@Body() dto: VerifyEmailRequestDto) {
        return this.verifyEmail(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    @Login()
    login(@Req() req: Request, @Res() res: Response) {
        res.cookie('jwt', req.user, {
                httpOnly: false,
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 3, // 3h
            })
            .end();
    }
}