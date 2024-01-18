import { UseGuards, applyDecorators } from "@nestjs/common";
import { AuthenticateGuard } from "../guard/authenticate.guard";

export const Authenticate = () => applyDecorators(UseGuards(AuthenticateGuard));