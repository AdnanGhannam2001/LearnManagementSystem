import { DatabaseModule } from '@database';
import { Module } from '@nestjs/common';

@Module({
    imports: [DatabaseModule]
})
export class AppModule { }