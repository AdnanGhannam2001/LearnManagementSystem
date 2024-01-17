import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { AUTH_SERVICE_NAME, AuthServiceClient } from "@protobuf/auth";

@Injectable()
export class UsersService implements OnModuleInit {
    private authService: AuthServiceClient;
    
    constructor(@Inject(AUTH_SERVICE_NAME) private authClient: ClientGrpc) {}

    onModuleInit() {
        this.authService = this.authClient.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
    }
}