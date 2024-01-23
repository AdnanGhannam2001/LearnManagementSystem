import { UseGuards, applyDecorators } from "@nestjs/common";
import { ClaimsAuthorizeRequest } from "@protobuf/auth";
import { SetOperation, TSetOperation } from "./set-operation.decorator";
import { ClaimsAuthorizeGuard } from "../guard/claims-authorize.guard";

export const ClaimsAuthorize =
    (options: TSetOperation) =>
        applyDecorators(SetOperation(options), UseGuards(ClaimsAuthorizeGuard));