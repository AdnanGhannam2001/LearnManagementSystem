import { PartialType } from "@nestjs/mapped-types";
import { CreateUnitRequestDto } from "./create-unit.request";

export class UpdateUnitRequestDto extends PartialType(CreateUnitRequestDto) { }