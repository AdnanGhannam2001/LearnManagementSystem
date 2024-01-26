import { IsBoolean, IsOptional } from "class-validator";

export class UpdateSettingsRequestDto {
    @IsOptional()
    @IsBoolean()
    readonly notifications: boolean;
    
    @IsOptional()
    @IsBoolean()
    readonly emails: boolean;
}