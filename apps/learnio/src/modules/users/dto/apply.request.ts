import { MaxLength } from "class-validator";

export class ApplyRequestDto {
    @MaxLength(500)
    details: string;
}