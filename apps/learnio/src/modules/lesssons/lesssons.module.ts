import { Module } from "@nestjs/common";
import { LessonsController } from "./lesssons.controller";
import { LessonsService } from "./lesssons.service";

@Module({
    controllers: [LessonsController],
    providers: [LessonsService],
    exports: [LessonsService]
})
export class LessonsModule { }