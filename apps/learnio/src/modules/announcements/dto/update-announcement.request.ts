import { PartialType } from "@nestjs/mapped-types";
import { CreateAnnouncementsRequestDto } from "./create-announcement.request";

export class UpdateAnnouncementsRequestDto extends PartialType(CreateAnnouncementsRequestDto) { }