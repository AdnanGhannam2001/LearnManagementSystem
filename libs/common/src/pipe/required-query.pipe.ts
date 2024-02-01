import { BadRequestException, ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Request } from "express";

export const RequiredQuery = createParamDecorator((data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();

    const value = req.query[data];

    if (!value) {
        throw new BadRequestException(`Query param '${data}' is required`);
    }
    return value;
});