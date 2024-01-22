/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { EmptyOrError, Error, GetAllRequest } from "./_shared";

export const protobufPackage = "learnio.user";

export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string | undefined;
  image?: string | undefined;
  permission: string;
  /**
   * google.protobuf.Timestamp joined_at = 8;
   * google.protobuf.Timestamp updated_at = 9;
   */
  isActivated: boolean;
}

export interface Settings {
  notifications?: boolean | undefined;
  emails?: boolean | undefined;
}

export interface Apply {
  id: string;
  details: string;
  /** google.protobuf.Any sent_at = 3; */
  status: string;
  response: string;
}

export interface GetAllResponse {
  users: User[];
  count: number;
}

export interface GetByIdRequest {
  id: string;
}

export interface UpdateRequest {
  id: string;
  name?: string | undefined;
  bio?: string | undefined;
}

export interface UserResponse {
  user?: User | undefined;
  error?: Error | undefined;
}

export interface ChangePasswordRequest {
  id: string;
  newPassword: string;
  password?: string | undefined;
  resetCode?: string | undefined;
}

export interface ChangeImageRequest {
  id: string;
  url?: string | undefined;
}

export interface UpdateSettingsRequest {
  id: string;
  settings: Settings | undefined;
}

export interface GetSettingsResponse {
  settings?: Settings | undefined;
  error?: Error | undefined;
}

export interface ChangePermissionRequest {
  id: string;
  permission: string;
}

export interface ApplyRequest {
  id: string;
  details: string;
}

export interface GetRequestStatusResponse {
  request?: Apply | undefined;
  error?: Error | undefined;
}

export interface GetAllRequestsResponse {
  requests: GetRequestStatusResponse[];
}

export const LEARNIO_USER_PACKAGE_NAME = "learnio.user";

export interface UserServiceClient {
  getAll(request: GetAllRequest): Observable<GetAllResponse>;

  getById(request: GetByIdRequest): Observable<UserResponse>;

  updateById(request: UpdateRequest): Observable<UserResponse>;

  deleteById(request: GetByIdRequest): Observable<EmptyOrError>;

  changePassword(request: ChangePasswordRequest): Observable<EmptyOrError>;

  changeImage(request: ChangeImageRequest): Observable<EmptyOrError>;

  getSettings(request: GetByIdRequest): Observable<GetSettingsResponse>;

  updateSettings(request: UpdateSettingsRequest): Observable<GetSettingsResponse>;

  changePermission(request: ChangePermissionRequest): Observable<EmptyOrError>;

  apply(request: ApplyRequest): Observable<EmptyOrError>;

  getRequestStatus(request: GetByIdRequest): Observable<GetRequestStatusResponse>;

  getAllRequests(request: GetAllRequest): Observable<GetAllRequestsResponse>;

  respond(request: GetByIdRequest): Observable<EmptyOrError>;
}

export interface UserServiceController {
  getAll(request: GetAllRequest): Promise<GetAllResponse> | Observable<GetAllResponse> | GetAllResponse;

  getById(request: GetByIdRequest): Promise<UserResponse> | Observable<UserResponse> | UserResponse;

  updateById(request: UpdateRequest): Promise<UserResponse> | Observable<UserResponse> | UserResponse;

  deleteById(request: GetByIdRequest): Promise<EmptyOrError> | Observable<EmptyOrError> | EmptyOrError;

  changePassword(request: ChangePasswordRequest): Promise<EmptyOrError> | Observable<EmptyOrError> | EmptyOrError;

  changeImage(request: ChangeImageRequest): Promise<EmptyOrError> | Observable<EmptyOrError> | EmptyOrError;

  getSettings(
    request: GetByIdRequest,
  ): Promise<GetSettingsResponse> | Observable<GetSettingsResponse> | GetSettingsResponse;

  updateSettings(
    request: UpdateSettingsRequest,
  ): Promise<GetSettingsResponse> | Observable<GetSettingsResponse> | GetSettingsResponse;

  changePermission(request: ChangePermissionRequest): Promise<EmptyOrError> | Observable<EmptyOrError> | EmptyOrError;

  apply(request: ApplyRequest): Promise<EmptyOrError> | Observable<EmptyOrError> | EmptyOrError;

  getRequestStatus(
    request: GetByIdRequest,
  ): Promise<GetRequestStatusResponse> | Observable<GetRequestStatusResponse> | GetRequestStatusResponse;

  getAllRequests(
    request: GetAllRequest,
  ): Promise<GetAllRequestsResponse> | Observable<GetAllRequestsResponse> | GetAllRequestsResponse;

  respond(request: GetByIdRequest): Promise<EmptyOrError> | Observable<EmptyOrError> | EmptyOrError;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getAll",
      "getById",
      "updateById",
      "deleteById",
      "changePassword",
      "changeImage",
      "getSettings",
      "updateSettings",
      "changePermission",
      "apply",
      "getRequestStatus",
      "getAllRequests",
      "respond",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USER_SERVICE_NAME = "UserService";
