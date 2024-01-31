import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { LessonsService } from "./lesssons.service";
import { ObjectType } from "@protobuf/auth";
import { Action } from "@protobuf/auth";
import { Authenticate } from "../auth/decorator/authenticate.decorator";
import { ClaimsAuthorize } from "../auth/decorator/claims-authorize.decorator";
import { User } from "../users/decorator/user.decorator";
import { CreateLessonRequestDto } from "./dto/create-lesson.request";
import { UpdateLessonRequestDto } from "./dto/update-lesson.request";

@Controller('lesssons')
export class LessonsController {
    constructor(private readonly service: LessonsService) { }

    @Get(':id')
    @ClaimsAuthorize({
        objectType: ObjectType.LESSON,
        action: Action.READ
    })
    @Authenticate()
    findOne(@Param('id') id) {
        return this.service.findOneOrThrow({ where: { id } });
    }

    // TODO: fix this (objectId?)
    @Post()
    @ClaimsAuthorize({
        objectType: ObjectType.LESSON,
        action: Action.CREATE
    })
    @Authenticate()
    create(@User() user, @Body() dto: CreateLessonRequestDto) {
        return this.service.create({
            data: { ...dto }
        });
    }

    @Patch(':id')
    @ClaimsAuthorize({
        objectType: ObjectType.LESSON,
        action: Action.UPDATE
    })
    @Authenticate()
    update(@Param('id') id, @Body() dto: UpdateLessonRequestDto) {
        return this.service.update({
            where: { id },
            data: {
                ...(dto.title ? { title: dto.title } : {}),
                ...(dto.about ? { about: dto.about } : {}),
                ...(dto.type ? { type: dto.type } : {}),
                ...(dto.order ? { order: dto.order } : {})
            }
        });
    }

    @Delete(':id')
    @ClaimsAuthorize({
        objectType: ObjectType.LESSON,
        action: Action.DELETE
    })
    @Authenticate()
    delete(@Param('id') id) {
        return this.service.delete({ where: { id } });
    }
}