import { DatabaseModule } from '@database';
import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
    imports: [
        DatabaseModule,
        UsersModule,
        AuthModule
    ]
})
export class AppModule { }