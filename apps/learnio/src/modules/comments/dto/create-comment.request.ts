import { MaxLength } from "class-validator";

export class CreateCommentRequestDto {
    @MaxLength(1000)
    content: string;
}