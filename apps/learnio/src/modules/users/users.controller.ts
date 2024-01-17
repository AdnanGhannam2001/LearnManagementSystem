import { Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { Login } from "./decorator/login.decorator";
import { Response } from "express";

@Controller('users')
export class UsersController {
    constructor(private readonly service: UsersService) { }

    @Post('login')
    @Login()
    login(@Req() req, @Res() res: Response) {
        res.cookie('jwt', req.user, {
                httpOnly: false,
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 3, // 3h
            })
            .end();
    }
}