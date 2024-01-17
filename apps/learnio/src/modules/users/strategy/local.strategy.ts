import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { AUTH_SERVICE_NAME, AuthServiceClient } from '@protobuf/auth';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    private authService: AuthServiceClient;
    
    constructor(@Inject(AUTH_SERVICE_NAME) private authClient: ClientGrpc) {
        super();
    }

    onModuleInit() {
        this.authService = this.authClient.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
    }

    async validate(username: string, password: string) {
        const response = await lastValueFrom(this.authService.login({ email: username, password }))

        if (response.error) {
            throw new HttpException(response.error.message, response.error.code);
        }

        return response.token;
    }
}