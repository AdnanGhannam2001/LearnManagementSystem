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
import { User } from "./decorator/user.decorator";
import { UpdateSettingsRequestDto } from "./dto/update-settings.request";
import { ApplyRequestDto } from "./dto/apply.request";
import { RespondRequestDto } from "./dto/respond.request";
import { RoleAuthorize } from "../auth/decorator/role-authorize.decorator";

@Controller('api/users')
export class UsersApiController {
    constructor(private readonly service: UsersService) { }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('register')
    @Redirect('/users/verify-email')
    register(@Body() dto: RegisterRequestDto) {
        return this.service.register(dto);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Redirect('/users/login')
    @Post('verify-email')
    verifyEmail(@Body() dto: VerifyEmailRequestDto) {
        return this.service.verifyEmail(dto);
    }

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

    @Redirect('/', 301)
    @Post('logout')
    logout(@Res() res: Response) {
        res.clearCookie('jwt');
    }

    @Get('me/application')
    @Render('partials/application')
    @ClaimsAuthorize({
        objectType: ObjectType.APPLY_REQUEST,
        action: Action.READ
    })
    @Authenticate()
    getMyApplication(@User() user) {
        return this.service.getApplicationById({ id: user.id });
    }

    @Post('applications/send')
    @ClaimsAuthorize({
        objectType: ObjectType.APPLY_REQUEST,
        action: Action.CREATE
    })
    @Authenticate()
    apply(@User() user, @Body() dto: ApplyRequestDto) {
        return this.service.apply(user.id, dto);
    }

    @Post('applications/:id/respond')
    @RoleAuthorize('Moderator', 'Admin')
    @Authenticate()
    respond(@Param('id') id, @Body() dto: RespondRequestDto) {
        return this.service.respond(id, dto);
    }

    @Get('applications')
    @Authenticate()
    async getAllApplications(@Query('search') search = '',
        @Query('skip', new ParseIntPipe({ optional: true })) skip = 0,
        @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize = 20,
        @Query('desc', new ParseBoolPipe({ optional: true })) desc = false)
    {
        return this.service.getAllApplications({ search, skip, pageSize, desc });
    }

    @Get('applications/:id')
    @ClaimsAuthorize({
        objectType: ObjectType.APPLY_REQUEST,
        action: Action.READ
    })
    @Authenticate()
    getApplicationById(@Param('id') id) {
        return this.service.getApplicationById({ id });
    }

    @Get()
    @Render('partials/users-table')
    @Authenticate()
    async getAll(@Query('search') search = '',
        @Query('skip', new ParseIntPipe({ optional: true })) skip = 0,
        @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize = 20,
        @Query('desc', new ParseBoolPipe({ optional: true })) desc = false)
    {
        return this.service.getAll({ search, skip, pageSize, desc });
    }

    @Get('me')
    @Render('partials/user')
    @ClaimsAuthorize({
        objectType: ObjectType.USER,
        action: Action.READ
    })
    @Authenticate()
    getMyProfile(@User() user) {
        return this.service.getById({ id: user.id });
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

    @Get('me/settings')
    @Render('partials/settings')
    @ClaimsAuthorize({
        objectType: ObjectType.SETTINGS,
        action: Action.READ
    })
    @Authenticate()
    getSettings(@User() user) {
        return this.service.getSettings(user.id);
    }

    @Patch('me/settings')
    @ClaimsAuthorize({
        objectType: ObjectType.SETTINGS,
        action: Action.READ
    })
    @Authenticate()
    updateSettings(@User() user, @Body() dto: UpdateSettingsRequestDto) {
        return this.service.updateSettings(user.id, dto);
    }
}