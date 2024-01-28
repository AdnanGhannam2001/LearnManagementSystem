import { Controller, Get, Render, Req } from "@nestjs/common";
import { AuthService } from "./modules/auth/auth.service";
import { Request } from "express";

@Controller()
export class AppController {
    constructor(private readonly authService: AuthService) { }

    @Get()
    @Render('pages/index')
    async getIndex(@Req() req: Request) {
        const result = await this.authService.authenticate(req.cookies['jwt']);
        return { islogged: result.error == undefined };
    }
}