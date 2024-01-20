import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        DatabaseModule,
        UsersModule,
        AuthModule
    ],
})
export class AppModule {}