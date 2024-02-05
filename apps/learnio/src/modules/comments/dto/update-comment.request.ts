import { PartialType } from "@nestjs/mapped-types";
import { CreateCommentRequestDto } from "./create-comment.request";

export class UpdateCommentRequestDto extends PartialType(CreateCommentRequestDto) { }