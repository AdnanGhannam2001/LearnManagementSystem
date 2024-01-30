import { PartialType } from "@nestjs/mapped-types";
import { CreateCourseRequestDto } from "./create-course.request";

export class UpdateCourseRequestDto extends PartialType(CreateCourseRequestDto) { }