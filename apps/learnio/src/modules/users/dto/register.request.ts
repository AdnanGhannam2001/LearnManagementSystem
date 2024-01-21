import { IsEmail, IsString, IsStrongPassword, Length, MaxLength } from "class-validator";

export class RegisterRequestDto {
    @Length(4, 40)
    readonly name: string;

    @IsEmail()
    readonly email: string;

    @IsStrongPassword()
    readonly password: string;
}