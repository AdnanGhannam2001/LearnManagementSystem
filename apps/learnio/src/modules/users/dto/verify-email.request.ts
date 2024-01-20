import { IsEmail, IsString } from "class-validator";

export class VerifyEmailRequestDto {
    @IsEmail()
    readonly email: string;

    @IsString()
    readonly code: string;
}