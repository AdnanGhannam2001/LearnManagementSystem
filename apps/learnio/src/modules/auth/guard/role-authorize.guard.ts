import { CanActivate, ExecutionContext, HttpException, Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ClientGrpc } from "@nestjs/microservices";
import { Permissions } from "@prisma/client";
import { AUTH_SERVICE_NAME, AuthServiceClient } from "@protobuf/auth";
import { Request } from "express";
import { firstValueFrom } from "rxjs";
import { REQUIRED_PERMISSIONS } from "../decorator/required-permissions.decorator";

@Injectable()
export class RoleAuthorizeGuard implements CanActivate, OnModuleInit {
    private authService: AuthServiceClient;

    constructor(@Inject(AUTH_SERVICE_NAME) private readonly authClient: ClientGrpc,
                private readonly ref: Reflector) { }

    onModuleInit() {
        this.authService = this.authClient.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
    }

    async canActivate(context: ExecutionContext) {
        const requiredPermissions = this.ref.getAllAndOverride<Permissions[]>(REQUIRED_PERMISSIONS, [
            context.getHandler(),
            context.getClass()
        ]);

        const req = context.switchToHttp().getRequest() as Request;

        const response = await firstValueFrom(this.authService.roleAuthorize({
            token: req.cookies['jwt'],
            requiredPermissions
        }));

        if (response.error) {
            throw new HttpException(response.error.message, response.error.code);
        }

        return response.allowed;
    }
}