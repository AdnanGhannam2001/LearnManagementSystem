import { SetMetadata } from "@nestjs/common";
import { ClaimsAuthorizeRequest } from "@protobuf/auth";

export type TSetOperation = Omit<ClaimsAuthorizeRequest, 'user' | 'objectId'>;
export const SET_OPERATION = 'SetOperation';
export const SetOperation = (options: TSetOperation) => SetMetadata(SET_OPERATION, options);