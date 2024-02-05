import { Body, Controller, Delete, Get, Param, ParseBoolPipe, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { ClaimsAuthorize } from "../auth/decorator/claims-authorize.decorator";
import { Authenticate } from "../auth/decorator/authenticate.decorator";
import { Action, ObjectType } from "@protobuf/auth";
import { User } from "../users/decorator/user.decorator";
import { CreateCommentRequestDto } from "./dto/create-comment.request";
import { UpdateCommentRequestDto } from "./dto/update-comment.request";

@Controller('comments')
export class CommentsController {
    constructor(private readonly service: CommentsService) { }

    @Get('lessons/:id')
    @ClaimsAuthorize({
        objectType: ObjectType.LESSON,
        action: Action.READ
    })
    @Authenticate()
    findAllOnLesson(@Param('id') lessonId,
        @Query('search') search = '',
        @Query('skip', new ParseIntPipe({ optional: true })) skip = 0,
        @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize = 20,
        @Query('desc', new ParseBoolPipe({ optional: true })) desc = false)
    {
        return this.service.findAll({
            where: {
                lessonId,
                content: {
                    contains: search,
                    mode: 'insensitive'
                }
            },
            include: { user: true, votes: true },
            skip,
            take: pageSize,
            orderBy: { createdAt: desc ? 'desc' : 'asc' }
        });
    }

    @Get('questions/:id')
    @ClaimsAuthorize({
        objectType: ObjectType.QUESTION,
        action: Action.READ
    })
    @Authenticate()
    findAllOnQuestion(@Param('id') questionId,
        @Query('search') search = '',
        @Query('skip', new ParseIntPipe({ optional: true })) skip = 0,
        @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize = 20,
        @Query('desc', new ParseBoolPipe({ optional: true })) desc = false)
    {
        return this.service.findAll({
            where: {
                questionId,
                content: {
                    contains: search,
                    mode: 'insensitive'
                }
            },
            include: { user: true, votes: true },
            skip,
            take: pageSize,
            orderBy: { createdAt: desc ? 'desc' : 'asc' }
        });
    }

    @Get(':id')
    @ClaimsAuthorize({
        objectType: ObjectType.COMMENT,
        action: Action.READ
    })
    @Authenticate()
    findOne(@Param('id') id) {
        return this.service.findOne({ where: { id } });
    }

    @Post('lessons/:id')
    @ClaimsAuthorize({
        objectType: ObjectType.COMMENT,
        action: Action.CREATE
    })
    @Authenticate()
    createOnLesson(@Param('id') lessonId, @User() user, @Body() dto: CreateCommentRequestDto) {
        return this.service.create({
            data: {
                lesson: { connect: { id: lessonId } },
                content: dto.content,
                user: { connect: { id: user.id } }
            }
        });
    }

    @Post('questions/:id')
    @ClaimsAuthorize({
        objectType: ObjectType.QUESTION,
        action: Action.READ
    })
    @Authenticate()
    createOnQuestion(@Param('id') questionId, @User() user, @Body() dto: CreateCommentRequestDto) {
        return this.service.create({
            data: {
                question: { connect: { id: questionId } },
                content: dto.content,
                user: { connect: { id: user.id } }
            }
        });
    }

    @Patch(':id')
    @ClaimsAuthorize({
        objectType: ObjectType.COMMENT,
        action: Action.UPDATE
    })
    @Authenticate()
    update(@Param('id') id, @Body() dto: UpdateCommentRequestDto) {
        return this.service.update({
            where: { id },
            data: { content: dto.content }
        });
    }

    @Delete(':id')
    @ClaimsAuthorize({
        objectType: ObjectType.COMMENT,
        action: Action.DELETE
    })
    @Authenticate()
    delete(@Param('id') id) {
        return this.service.delete({ where: { id } });
    }
}