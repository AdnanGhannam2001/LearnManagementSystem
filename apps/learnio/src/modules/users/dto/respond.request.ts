import { ApplyRequestStatus } from "@prisma/client";
import { IsEnum, IsOptional, MaxLength } from "class-validator";

export class RespondRequestDto {
    @IsEnum(ApplyRequestStatus)
    @IsOptional()
    status: string;

    @MaxLength(500)
    response: string;
}