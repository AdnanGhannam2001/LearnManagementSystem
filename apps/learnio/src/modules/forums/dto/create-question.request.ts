import { MaxLength } from "class-validator"

export class CreateQuestionRequestDto {
    @MaxLength(100)
    title: string;

    @MaxLength(2000)
    content: string;
}