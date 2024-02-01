import { Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { CartsService } from "./carts.service";
import { Authenticate } from "../auth/decorator/authenticate.decorator";
import { User } from "../users/decorator/user.decorator";
import { CoursesService } from "../courses/courses.service";

@Controller('carts')
export class CartsController {
    constructor(private readonly service: CartsService,
        private readonly coursesServices: CoursesService) { }

    @Get()
    @Authenticate()
    getMyCart(@User() user) {
        return this.service.findOne({
            where: { userId: user.id },
            include: { courses: true }
        });
    }

    @Post(':id')
    @Authenticate()
    async add(@Param('id') id, @User() user) {
        await this.coursesServices.findOneOrThrow({ where: { id }});

        return this.service.update({
            where: { userId: user.id },
            data: { courses: { connect: { id } } }
        });
    }

    @Delete(':id')
    @Authenticate()
    async delete(@Param('id') id, @User() user) {
        await this.coursesServices.findOneOrThrow({ where: { id }});

        return this.service.update({
            where: { userId: user.id },
            data: { courses: { disconnect: { id } } }
        });
    }
}