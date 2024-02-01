import { DatabaseModule } from '@database';
import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { RmqModule } from '@rmq';
import { MAIL_SERVICE } from '../../../libs/common/src/constants';
import { AppController } from './app.controller';
import { CoursesModule } from './modules/courses/courses.module';
import { UnitsModule } from './modules/units/units.module';
import { LessonsModule } from './modules/lesssons/lesssons.module';
import { CoachesModule } from './modules/coaches/coaches.module';

@Module({
    imports: [
        DatabaseModule,
        AuthModule,
        UsersModule,
        CoursesModule,
        UnitsModule,
        LessonsModule,
        CoachesModule,
        RmqModule.register(MAIL_SERVICE)
    ],
    controllers: [AppController]
})
export class AppModule { }