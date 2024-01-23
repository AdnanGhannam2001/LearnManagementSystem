import { IsOptional, Length, MaxLength } from "class-validator";

export class UpdateUserRequestDto {
    @IsOptional()
    @Length(4, 40)
    readonly name: string;

    @IsOptional()
    @MaxLength(1000)
    readonly bio: string;
}