import { BadRequestException, HttpException, Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { AUTH_SERVICE_NAME, AuthServiceClient } from "@protobuf/auth";
import { RegisterRequestDto } from "./dto/register.request";
import { firstValueFrom } from "rxjs";
import { VerifyEmailRequestDto } from "./dto/verify-email.request";

@Injectable()
export class UsersService implements OnModuleInit {
    private authService: AuthServiceClient;
    
    constructor(@Inject(AUTH_SERVICE_NAME) private authClient: ClientGrpc) {}

    onModuleInit() {
        this.authService = this.authClient.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
    }

    async register(dto: RegisterRequestDto) {
        const response = await firstValueFrom(this.authService.register(dto));

        if (response.error) {
            throw new HttpException(response.error.message, response.error.code);
        }

        // TODO: send email
        return response;
    }

    async verifyEmail(dto: VerifyEmailRequestDto) {
        const response = await firstValueFrom(this.authService.verifyEmail(dto));

        if (response.error) {
            throw new HttpException(response.error.message, response.error.code);
        }
    }
}