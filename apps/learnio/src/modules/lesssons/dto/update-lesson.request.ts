import { PartialType } from "@nestjs/mapped-types";
import { CreateLessonRequestDto } from "./create-lesson.request";

export class UpdateLessonRequestDto extends PartialType(CreateLessonRequestDto) { }