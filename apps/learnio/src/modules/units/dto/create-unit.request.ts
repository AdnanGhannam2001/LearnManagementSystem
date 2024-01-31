import { IsInt, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateUnitRequestDto {
    @MaxLength(100)
    title: string;

    @IsOptional()
    @MaxLength(250)
    about: string;

    @IsInt()
    order: number;

    @IsString()
    courseId: string;
}