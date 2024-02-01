import { Module } from "@nestjs/common";
import { CartsController } from "./carts.controller";
import { CartsService } from "./carts.service";
import { CoursesModule } from "../courses/courses.module";

@Module({
    imports: [CoursesModule],
    controllers: [CartsController],
    providers: [CartsService],
    exports: [CartsService]
})
export class CartsModule { }