import { PartialType } from "@nestjs/mapped-types";
import { CreateQuestionRequestDto } from "./create-question.request";

export class UpdateQuestionRequestDto extends PartialType(CreateQuestionRequestDto) { }