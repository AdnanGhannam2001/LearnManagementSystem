import { UseGuards, applyDecorators } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

export const Login = () => applyDecorators(UseGuards(AuthGuard('local')));