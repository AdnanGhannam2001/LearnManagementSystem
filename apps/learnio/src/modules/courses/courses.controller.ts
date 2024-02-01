import { Body, Controller, Delete, Get, Param, ParseBoolPipe, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { CoursesService } from "./courses.service";
import { Authenticate } from "../auth/decorator/authenticate.decorator";
import { ClaimsAuthorize } from "../auth/decorator/claims-authorize.decorator";
import { Action, ObjectType } from "@protobuf/auth";
import { User } from "../users/decorator/user.decorator";
import { CreateCourseRequestDto } from "./dto/create-course.request";
import { UpdateCourseRequestDto } from "./dto/update-course.request";
import { RoleAuthorize } from "../auth/decorator/role-authorize.decorator";
import { CoachesService } from "../coaches/coaches.service";
import { RequiredQuery } from "@common";

@Controller('courses')
export class CoursesController {
    constructor(private readonly service: CoursesService,
        private readonly coachesService: CoachesService) { }

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
                        brief: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                ]
            },
            include: {
                categories: true,
                languages: true,
                _count: { select: { coaches: true, students: true } }
            },
            skip,
            take: pageSize,
            orderBy: { title: desc ? 'desc' : 'asc' }
        });
    }

    @Get(':id')
    findOne(@Param('id') id) {
        return this.service.findOneOrThrow({ where: { id } });
    }

    @Post()
    @RoleAuthorize('Coach')
    @Authenticate()
    create(@User() user, @Body() dto: CreateCourseRequestDto) {
        return this.service.create({
            data: {
                ...dto,
                creator: { connect: { id: user.id } },
                coaches: { create: { userId: user.id } },
                categories: {
                    connectOrCreate: dto.categories.map(cate => ({
                        where: { label: cate },
                        create: { label: cate }
                    }))
                },
                languages: {
                    connectOrCreate: dto.languages.map(lang => ({
                        where: { name: lang },
                        create: { name: lang }
                    }))
                }
            }
        });
    }

    @Patch(':id')
    @ClaimsAuthorize({
        objectType: ObjectType.COURSE,
        action: Action.UPDATE
    })
    @Authenticate()
    update(@Param('id') id, @Body() dto: UpdateCourseRequestDto) {
        return this.service.update({
            where: { id },
            data: {
                ...(dto.title ? { title: dto.title } : {}),
                ...(dto.brief ? { brief: dto.brief } : {}),
                ...(dto.about ? { about: dto.about } : {}),
                ...(dto.requirements ? { requirements: dto.requirements } : {}),
                ...(dto.description ? { description: dto.description } : {}) ,
                ...(dto.categories ? {
                    categories: {
                        connectOrCreate: dto.categories.map(cate => ({
                            where: { label: cate },
                            create: { label: cate }
                        }))
                    }
                } : {}),
                ...(dto.languages ? {
                    languages: {
                        connectOrCreate: dto.languages.map(lang => ({
                            where: { name: lang },
                            create: { name: lang }
                        }))
                    }
                } : {})
            }
        });
    }

    @Delete(':id')
    @ClaimsAuthorize({
        objectType: ObjectType.COURSE,
        action: Action.DELETE
    })
    @Authenticate()
    delete(@Param('id') id) {
        return this.service.delete({ where: { id } });
    }

    @Get(':id/coaches')
    findAllCoaches(@Param('id') id,
        @Query('search') search = '',
        @Query('skip', new ParseIntPipe({ optional: true })) skip = 0,
        @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize = 20,
        @Query('desc', new ParseBoolPipe({ optional: true })) desc = false)
    {
        return this.coachesService.findAll({
            where: {
                courseId: id,
                user: {
                    name: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            },
            include: {
                user: {
                    select: { id: true, name: true  }
                }
            },
            skip,
            take: pageSize,
            orderBy: { startedAt: desc ? 'desc' : 'asc' }
        });
    }

    @Get(':id/rolled')
    @ClaimsAuthorize({
        objectType: ObjectType.ROLLED,
        action: Action.DELETE
    })
    @Authenticate()
    findAllRolled(@Param('id') id,
        @Query('search') search = '',
        @Query('skip', new ParseIntPipe({ optional: true })) skip = 0,
        @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize = 20,
        @Query('desc', new ParseBoolPipe({ optional: true })) desc = false)
    {
        return this.service.findAllRolled({
            where: {
                courseId: id,
                user: {
                    name: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            },
            include: {
                user: {
                    select: { id: true, name: true  }
                }
            },
            skip,
            take: pageSize,
            orderBy: { rolledAt: desc ? 'desc' : 'asc' }
        });
    }

    @Post(':id/coaches')
    @ClaimsAuthorize({
        objectType: ObjectType.COURSE,
        action: Action.UPDATE
    })
    @Authenticate()
    addCoach(@Param('id') id, @RequiredQuery('userId') userId) {
        return this.coachesService.create({
            data: {
                course: { connect: { id } },
                user: { connect: { id: userId } }
            }
        });
    }

    @Delete(':id/coaches')
    @ClaimsAuthorize({
        objectType: ObjectType.COURSE,
        action: Action.UPDATE
    })
    @Authenticate()
    removeCoach(@Param('id') id, @RequiredQuery('userId') userId) {
        return this.coachesService.delete({
            where: { userId_courseId: { courseId: id, userId } }
        });
    }
}