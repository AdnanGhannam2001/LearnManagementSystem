import { Controller, Get, Post, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { AuthGuard } from "@nestjs/passport";

@Controller('users')
export class UsersController {
    constructor(private readonly service: UsersService) { }

    @Post('login')
    @UseGuards(AuthGuard('local'))
    login() {
        return this.service.login();
    }
}