import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseBoolPipe, ParseIntPipe, Patch, Post, Query, Redirect, Render, Req, Res } from "@nestjs/common";
import { UsersService } from "./users.service";
import { Login } from "./decorator/login.decorator";
import { Request, Response } from "express";
import { RegisterRequestDto } from "./dto/register.request";
import { VerifyEmailRequestDto } from "./dto/verify-email.request";
import { Authenticate } from "../auth/decorator/authenticate.decorator";
import { ClaimsAuthorize } from "../auth/decorator/claims-authorize.decorator";
import { Action, ObjectType } from "@protobuf/auth";
import { UpdateUserRequestDto } from "./dto/update-user.request";

@Controller('users')
export class UsersController {
    constructor(private readonly service: UsersService) { }

    @Get('register')
    @Render('pages/register')
    getRegister() { }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('register')
    @Redirect('/users/verify-email')
    register(@Body() dto: RegisterRequestDto) {
        return this.service.register(dto);
    }

    @Get('verify-email')
    @Render('pages/verify-email')
    getVerifyEmail() { }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Redirect('/users/login')
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

    @HttpCode(204)
    @Post('logout')
    logout(@Res() res: Response) {
        res.clearCookie('jwt').end();
    }

    @Get()
    @Authenticate()
    getAll(@Query('id') id = '',
        @Query('search') search = '',
        @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize = 20,
        @Query('desc', new ParseBoolPipe({ optional: true })) desc = false)
    {
        return this.service.getAll({ id, search, pageSize, desc });
    }

    @Get(':id')
    @ClaimsAuthorize({
        objectType: ObjectType.USER,
        action: Action.READ
    })
    @Authenticate()
    getById(@Param('id') id) {
        return this.service.getById({ id });
    }

    @Patch(':id')
    @ClaimsAuthorize({
        objectType: ObjectType.USER,
        action: Action.UPDATE
    })
    @Authenticate()
    update(@Param('id') id, @Body() dto: UpdateUserRequestDto) {
        return this.service.update({ id, ...dto });
    }

    @Delete(':id')
    @ClaimsAuthorize({
        objectType: ObjectType.USER,
        action: Action.DELETE
    })
    @Authenticate()
    delete(@Param('id') id) {
        return this.service.delete({ id });
    }
}