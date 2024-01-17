import { DatabaseModule } from '@database';
import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';

@Module({
    imports: [
        DatabaseModule,
        UsersModule
    ]
})
export class AppModule { }