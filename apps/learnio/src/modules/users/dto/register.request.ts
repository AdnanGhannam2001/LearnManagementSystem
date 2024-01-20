import { IsEmail, IsStrongPassword, MaxLength } from "class-validator";

export class RegisterRequestDto {
    @MaxLength(40)
    readonly name: string;

    @IsEmail()
    readonly email: string;

    @IsStrongPassword()
    readonly password: string;
}