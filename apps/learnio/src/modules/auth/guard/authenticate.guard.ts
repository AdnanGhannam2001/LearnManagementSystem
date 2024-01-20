import { CanActivate, ExecutionContext, HttpException, Inject, Injectable } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { AUTH_SERVICE_NAME, AuthServiceClient } from "@protobuf/auth";
import { Request } from "express";
import { firstValueFrom } from "rxjs";

@Injectable()
export class AuthenticateGuard implements CanActivate {
    private authService: AuthServiceClient;
    
    constructor(@Inject(AUTH_SERVICE_NAME) private readonly authClient: ClientGrpc) {}

    onModuleInit() {
        this.authService = this.authClient.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
    }

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest() as Request;

        const response = await firstValueFrom(
            this.authService.authenticate({ token: req.cookies['jwt'] }));

        if (response.error) {
            throw new HttpException(response.error.message, response.error.code);
        }

        req.user = response.user;

        return true;
    }
}