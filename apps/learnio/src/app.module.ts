import { DatabaseModule } from '@database';
import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { RmqModule } from '@rmq';
import { MAIL_SERVICE } from './constants';

@Module({
    imports: [
        DatabaseModule,
        UsersModule,
        AuthModule,
        RmqModule.register(MAIL_SERVICE)
    ]
})
export class AppModule { }