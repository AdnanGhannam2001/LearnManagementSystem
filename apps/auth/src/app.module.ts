import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ApplicationsModule } from './modules/applications/applications.module';

@Module({
    imports: [
        DatabaseModule,
        UsersModule,
        AuthModule,
        ApplicationsModule
    ],
})
export class AppModule {}