import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { AUTH_SERVICE_NAME, AuthServiceClient } from "@protobuf/auth";
import { firstValueFrom } from "rxjs";

@Injectable()
export class AuthService implements OnModuleInit {
    private authService: AuthServiceClient;
    
    constructor(@Inject(AUTH_SERVICE_NAME) private readonly authClient: ClientGrpc) {}

    onModuleInit() {
        this.authService = this.authClient.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
    }

    authenticate(token: string) {
        return firstValueFrom(this.authService.authenticate({ token }));
    }
}