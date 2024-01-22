import { HttpException, Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc, ClientProxy } from "@nestjs/microservices";
import { AUTH_SERVICE_NAME, AuthServiceClient } from "@protobuf/auth";
import { RegisterRequestDto } from "./dto/register.request";
import { firstValueFrom } from "rxjs";
import { VerifyEmailRequestDto } from "./dto/verify-email.request";
import { MAIL_SERVICE } from "../../constants";
import { Mail } from "@common";

@Injectable()
export class UsersService implements OnModuleInit {
    private authService: AuthServiceClient;
    
    constructor(@Inject(AUTH_SERVICE_NAME) private authClient: ClientGrpc,
                @Inject(MAIL_SERVICE) private mailService: ClientProxy) {}

    onModuleInit() {
        this.authService = this.authClient.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
    }

    async register(dto: RegisterRequestDto) {
        const response = await firstValueFrom(this.authService.register(dto));

        if (response.error) {
            throw new HttpException(response.error.message, response.error.code);
        }

        const mail: Mail = {
            receiver: response.success.email,
            subject: 'Thank you for registering on Learn.io!',
            body: `Verification Code: ${response.success.activateCode}` +
                    `If you haven't registered on [Your Website Name], please ignore this email.` +
                    `If you have any questions or concerns, feel free to contact our support team at 'learn-io@support.com'.` +
                    `Best regards,` +
                    `Learn.io Team'`
        };

        this.mailService.emit('send', mail).subscribe();
    }

    async verifyEmail(dto: VerifyEmailRequestDto) {
        const response = await firstValueFrom(this.authService.verifyEmail(dto));

        if (response.error) {
            throw new HttpException(response.error.message, response.error.code);
        }
    }
}