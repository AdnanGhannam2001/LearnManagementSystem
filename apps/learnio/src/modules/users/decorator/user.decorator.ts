import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Request } from "express";

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();

    return req.user;
});