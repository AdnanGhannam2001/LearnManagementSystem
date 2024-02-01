import { MaxLength } from "class-validator";

export class CreateAnnouncementsRequestDto {
    @MaxLength(2000)
    content: string;
}