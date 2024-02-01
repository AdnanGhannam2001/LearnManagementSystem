import { Controller, Delete, Get, Param, ParseBoolPipe, ParseFloatPipe, ParseIntPipe, Post, Query } from "@nestjs/common";
import { RatesService } from "./rates.service";
import { RequiredQuery } from "@common";
import { Authenticate } from "../auth/decorator/authenticate.decorator";
import { ClaimsAuthorize } from "../auth/decorator/claims-authorize.decorator";
import { Action, ObjectType } from "@protobuf/auth";
import { User } from "../users/decorator/user.decorator";

@Controller('rates')
export class RatesController {
    constructor(private readonly service: RatesService) { }

    @Get()
    findAll(@RequiredQuery('courseId') courseId,
        @Query('search') search = '',
        @Query('skip', new ParseIntPipe({ optional: true })) skip = 0,
        @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize = 20,
        @Query('desc', new ParseBoolPipe({ optional: true })) desc = false)
    {
        return this.service.findAll({
            where: {
                courseId,
                user: {
                    name: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            },
            include: {
                user: { select: { id: true, name: true } },
                course: { select: { id: true, title: true } }
            },
            skip,
            take: pageSize,
            orderBy: { ratedAt: desc ? 'desc' : 'asc' }
        });
    }

    @Post(':id')
    @ClaimsAuthorize({
        objectType: ObjectType.RATE,
        action: Action.CREATE
    })
    @Authenticate()
    create(@Param('id') courseId,
        @User() user,
        @Query('value', ParseFloatPipe) value) {
        return this.service.create({
            data: {
                course: { connect: { id: courseId } },
                user: { connect: { id: user.id } },
                value
            }
        });
    }

    @Delete(':id')
    @Authenticate()
    delete(@Param('id') courseId, @User() user) {
        return this.service.delete({
            where: { userId_courseId: { courseId, userId: user.id } }
        });
    }
}