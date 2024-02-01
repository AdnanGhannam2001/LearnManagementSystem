import { LessonTypes } from "@prisma/client"
import { IsEnum, IsInt, IsString, MaxLength } from "class-validator"

export class CreateLessonRequestDto {
    @MaxLength(100)
    title: string;
    
    @MaxLength(100)
    about: string;

    @IsInt()
    order: number;

    @IsEnum(LessonTypes)
    type: LessonTypes

    @IsString()
    unitId: string;
}