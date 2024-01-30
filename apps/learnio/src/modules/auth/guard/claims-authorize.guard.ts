import { CanActivate, ExecutionContext, HttpException, Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ClientGrpc } from "@nestjs/microservices";
import { User } from "@prisma/client";
import { AUTH_SERVICE_NAME, AuthServiceClient, ClaimsAuthorizeRequest } from "@protobuf/auth";
import { AUTH_SERVICE } from "@common/constants";
import { Request, Response } from "express";
import { firstValueFrom } from "rxjs";
import { SET_OPERATION } from "../decorator/set-operation.decorator";

@Injectable()
export class ClaimsAuthorizeGuard implements CanActivate, OnModuleInit {
    private authService: AuthServiceClient;

    constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientGrpc,
        private readonly ref: Reflector) { }

    onModuleInit() {
        this.authService = this.authClient.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
    }

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest<Request>();
        const options = this.ref.getAllAndOverride<ClaimsAuthorizeRequest>(SET_OPERATION, [
            context.getHandler(),
            context.getClass()
        ]);

        const response = await  firstValueFrom(this.authService.claimsAuthorize({
            user: req.user as User,
            action: options.action,
            objectId: req.params.id ?? (<User>req.user).id,
            objectType: options.objectType
        }));

        if (response.error) {
            throw new HttpException(response.error, response.error.code);
        }

        return response.allowed;
    }
}