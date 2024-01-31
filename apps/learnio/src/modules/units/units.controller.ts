import { Body, Controller, Delete, Get, Param, ParseBoolPipe, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { UnitsService } from "./units.service";
import { Action, ObjectType } from "@protobuf/auth";
import { Authenticate } from "../auth/decorator/authenticate.decorator";
import { ClaimsAuthorize } from "../auth/decorator/claims-authorize.decorator";
import { RoleAuthorize } from "../auth/decorator/role-authorize.decorator";
import { User } from "../users/decorator/user.decorator";
import { CreateUnitRequestDto } from "./dto/create-unit.request";
import { UpdateUnitRequestDto } from "./dto/update-unit.request";

@Controller('units')
export class UnitsController {
    constructor(private readonly service: UnitsService) { }

    @Get()
    findAll(@Query('search') search = '',
        @Query('skip', new ParseIntPipe({ optional: true })) skip = 0,
        @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize = 20,
        @Query('desc', new ParseBoolPipe({ optional: true })) desc = false)
    {
        return this.service.findAll({
            where: {
                OR: [
                    {
                        title: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    },
                    {
                        about: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                ]
            },
            include: {
                lessons: {
                    select: { id: true, title: true },
                    orderBy: { order: 'asc' }
                }
            },
            skip,
            take: pageSize,
            orderBy: { order: desc ? 'desc' : 'asc' }
        });
    }

    @Get(':id')
    findOne(@Param('id') id) {
        return this.service.findOneOrThrow({ where: { id } });
    }

    // TODO: fix this (objectId?)
    @Post()
    @ClaimsAuthorize({
        objectType: ObjectType.UNIT,
        action: Action.CREATE
    })
    @Authenticate()
    create(@User() user, @Body() dto: CreateUnitRequestDto) {
        return this.service.create({
            data: { ...dto }
        });
    }

    @Patch(':id')
    @ClaimsAuthorize({
        objectType: ObjectType.UNIT,
        action: Action.UPDATE
    })
    @Authenticate()
    update(@Param('id') id, @Body() dto: UpdateUnitRequestDto) {
        return this.service.update({
            where: { id },
            data: {
                ...(dto.title ? { title: dto.title } : {}),
                ...(dto.about ? { about: dto.about } : {}),
                ...(dto.order ? { order: dto.order } : {})
            }
        });
    }

    @Delete(':id')
    @ClaimsAuthorize({
        objectType: ObjectType.UNIT,
        action: Action.DELETE
    })
    @Authenticate()
    delete(@Param('id') id) {
        return this.service.delete({ where: { id } });
    }
}