import { CanActivate, ExecutionContext, HttpException, Inject, Injectable } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { AUTH_SERVICE_NAME, AuthServiceClient } from "@protobuf/auth";
import { Request } from "express";
import { firstValueFrom } from "rxjs";
import { AuthService } from "../auth.service";

@Injectable()
export class AuthenticateGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest<Request>();

        const response = await this.authService.authenticate(req.cookies['jwt']);

        if (response.error) {
            throw new HttpException(response.error, response.error.code);
        }

        req.user = response.user;

        return true;
    }
}