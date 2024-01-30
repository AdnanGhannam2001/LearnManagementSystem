import { IsString, MaxLength } from "class-validator";

export class CreateCourseRequestDto {
    @MaxLength(100)
    title: string;

    @MaxLength(250)
    brief: string;

    @IsString({ each: true })
    about: string[];
    
    @IsString({ each: true })
    requirements: string[];

    @MaxLength(1000)
    description: string;

    @IsString({ each: true })
    categories: string[];

    @IsString({ each: true })
    languages: string[];
}