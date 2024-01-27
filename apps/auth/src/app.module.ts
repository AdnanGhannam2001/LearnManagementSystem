import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ApplicationsController } from './modules/applications/applications.controller';

@Module({
    imports: [
        DatabaseModule,
        UsersModule,
        AuthModule,
        ApplicationsController
    ],
})
export class AppModule {}