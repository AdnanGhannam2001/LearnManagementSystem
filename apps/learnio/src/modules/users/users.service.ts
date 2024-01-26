import { HttpException, Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc, ClientProxy } from "@nestjs/microservices";
import { AUTH_SERVICE_NAME, AuthServiceClient } from "@protobuf/auth";
import { RegisterRequestDto } from "./dto/register.request";
import { firstValueFrom } from "rxjs";
import { VerifyEmailRequestDto } from "./dto/verify-email.request";
import { AUTH_SERVICE, MAIL_SERVICE } from "../../constants";
import { Mail } from "@common";
import { USER_SERVICE_NAME, UpdateRequest, UserServiceClient } from "@protobuf/user";
import { GetAllRequest, GetByIdRequest } from "@protobuf/_shared";
import { UpdateSettingsRequestDto } from "./dto/update-settings.request";

@Injectable()
export class UsersService implements OnModuleInit {
    private authService: AuthServiceClient;
    private userService: UserServiceClient;
    
    constructor(@Inject(AUTH_SERVICE) private authClient: ClientGrpc,
                @Inject(MAIL_SERVICE) private mailService: ClientProxy) {}

    onModuleInit() {
        this.authService = this.authClient.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
        this.userService = this.authClient.getService<UserServiceClient>(USER_SERVICE_NAME);
    }

    async register(dto: RegisterRequestDto) {
        const response = await firstValueFrom(this.authService.register(dto));

        if (response.error) {
            throw new HttpException(response.error, response.error.code);
        }

        const mail: Mail = {
            receiver: response.success.email,
            subject: 'Thank you for registering on Learn.io!',
            body: `Verification Code: ${response.success.activateCode}` +
                    `If you haven't registered on Learn.io, please ignore this email.` +
                    `If you have any questions or concerns, feel free to contact our support team at 'support@learn.io` +
                    `Best regards` +
                    `Learn.io Team'`
        };

        this.mailService.emit('send', mail).subscribe();
    }

    async verifyEmail(dto: VerifyEmailRequestDto) {
        const response = await firstValueFrom(this.authService.verifyEmail(dto));

        if (response.error) {
            throw new HttpException(response.error, response.error.code);
        }
    }

    getAll(options: GetAllRequest) {
        return this.userService.getAll(options);
    }

    async getById(options: GetByIdRequest) {
        const response = await firstValueFrom(this.userService.getById(options));

        if (response.error) {
            throw new HttpException(response.error, response.error.code);
        }

        return response.user;
    }

    async update(options: UpdateRequest) {
        const response = await firstValueFrom(this.userService.updateById(options));

        if (response.error) {
            throw new HttpException(response.error, response.error.code);
        }

        return response.user;
    }

    async delete(options: GetByIdRequest) {
        const response = await firstValueFrom(this.userService.deleteById(options));

        if (response.error) {
            throw new HttpException(response.error, response.error.code);
        }
    }

    async getSettings(id: string) {
        const response = await firstValueFrom(this.userService.getSettings({ id }));

        if (response.error) {
            throw new HttpException(response.error, response.error.code);
        }

        return response.settings;
    }

    async updateSettings(id: string, dto: UpdateSettingsRequestDto) {
        const response = await firstValueFrom(this.userService.updateSettings({ id, settings: dto }));

        if (response.error) {
            throw new HttpException(response.error, response.error.code);
        }

        return response.settings;
    }
}