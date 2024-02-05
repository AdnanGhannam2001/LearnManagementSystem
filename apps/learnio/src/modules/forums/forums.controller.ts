import { Body, Controller, Delete, Get, Param, ParseBoolPipe, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { Authenticate } from "../auth/decorator/authenticate.decorator";
import { ClaimsAuthorize } from "../auth/decorator/claims-authorize.decorator";
import { Action, ObjectType } from "@protobuf/auth";
import { ForumsService } from "./forums.service";
import { CreateQuestionRequestDto } from "./dto/create-question.request";
import { User } from "../users/decorator/user.decorator";
import { UpdateQuestionRequestDto } from "./dto/update-question.request";

@Controller('forums')
export class ForumsController {
    constructor(private readonly service: ForumsService) { }

    @Get(':id')
    @ClaimsAuthorize({
        objectType: ObjectType.FORUM,
        action: Action.READ
    })
    @Authenticate()
    getAll(@Param('id') forumId,
        @Query('search') search = '',
        @Query('skip', new ParseIntPipe({ optional: true })) skip = 0,
        @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize = 20,
        @Query('desc', new ParseBoolPipe({ optional: true })) desc = false)
    {
        return this.service.getAll({ forumId, search, skip, pageSize, desc });
    }

    @Get('questions/:id')
    @ClaimsAuthorize({
        objectType: ObjectType.QUESTION,
        action: Action.READ
    })
    @Authenticate()
    getOne(@Param('id') id) {
        return this.service.getOne({ id });
    }

    @Post('questions/:id')
    @ClaimsAuthorize({
        objectType: ObjectType.QUESTION,
        action: Action.CREATE
    })
    @Authenticate()
    create(@Param('id') forumId,
        @User() user,
        @Body() dto: CreateQuestionRequestDto)
    {
        return this.service.create({ ...dto, userId: user.id, forumId });
    }

    @Patch('questions/:id')
    @ClaimsAuthorize({
        objectType: ObjectType.QUESTION,
        action: Action.UPDATE
    })
    @Authenticate()
    update(@Param('id') id, @Body() dto: UpdateQuestionRequestDto) {
        return this.service.update({
            id,
            ...(dto.title ? { title: dto.title } : {}),
            ...(dto.content ? { content: dto.content } : {})
        });
    }

    @Delete('questions/:id')
    @ClaimsAuthorize({
        objectType: ObjectType.QUESTION,
        action: Action.DELETE
    })
    @Authenticate()
    delete(@Param('id') id) {
        return this.service.delete({ id });
    }
}