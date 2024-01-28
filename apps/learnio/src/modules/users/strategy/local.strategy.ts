import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { AUTH_SERVICE_NAME, AuthServiceClient } from '@protobuf/auth';
import { firstValueFrom, of } from 'rxjs';
import { AUTH_SERVICE } from '@common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    private authService: AuthServiceClient;
    
    constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientGrpc) {
        super();
    }

    onModuleInit() {
        this.authService = this.authClient.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
    }

    async validate(email: string, password: string) {
        const response = await firstValueFrom(this.authService.login({ email, password }))

        if (response.error) {
            throw new HttpException(response.error, response.error.code);
        }

        return response.token;
    }
}