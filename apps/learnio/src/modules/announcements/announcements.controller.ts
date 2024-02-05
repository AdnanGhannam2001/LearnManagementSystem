import { Body, Controller, Get, Param, ParseBoolPipe, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { AnnouncementsService } from "./announcements.service";
import { Authenticate } from "../auth/decorator/authenticate.decorator";
import { ClaimsAuthorize } from "../auth/decorator/claims-authorize.decorator";
import { Action, ObjectType } from "@protobuf/auth";
import { User } from "../users/decorator/user.decorator";
import { CreateAnnouncementsRequestDto } from "./dto/create-announcement.request";
import { UpdateAnnouncementsRequestDto } from "./dto/update-announcement.request";

@Controller('announcements')
export class AnnouncementsController {
    constructor(private readonly service: AnnouncementsService) { }

    @Get(':id')
    @Authenticate()
    findAll(@Param('id') courseId,
        @Query('search') search = '',
        @Query('skip', new ParseIntPipe({ optional: true })) skip = 0,
        @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize = 20,
        @Query('desc', new ParseBoolPipe({ optional: true })) desc = false)
    {
        return this.service.findAll({
            where: {
                courseId,
                content: {
                    contains: search,
                    mode: 'insensitive'
                }
            },
            include: { user: { select: { id: true, name: true } } },
            skip,
            take: pageSize,
            orderBy: { announcedAt: desc ? 'desc' : 'asc' }
        });
    }

    @Post(':id')
    @ClaimsAuthorize({
        objectType: ObjectType.COURSE,
        action: Action.UPDATE
    })
    @Authenticate()
    create(@Param('id') courseId,
        @User() user,
        @Body() dto: CreateAnnouncementsRequestDto)
    {
        return this.service.create({
            data: {
                ...dto,
                course: { connect: { id: courseId } },
                user: { connect: { id: user.id } }
            }
        });
    }

    @Patch(':id')
    @ClaimsAuthorize({
        objectType: ObjectType.ANNOUNCEMENT,
        action: Action.UPDATE
    })
    @Authenticate()
    update(@Param('id') id,
        @Body() dto: UpdateAnnouncementsRequestDto)
    {
        return this.service.update({
            where: { id },
            data: { ...dto }
        });
    }

    @Patch(':id')
    @ClaimsAuthorize({
        objectType: ObjectType.ANNOUNCEMENT,
        action: Action.DELETE
    })
    @Authenticate()
    delete(@Param('id') id) {
        return this.service.delete({ where: { id } });
    }
}