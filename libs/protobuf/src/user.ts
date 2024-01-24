/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { EmptyOrError, Error, GetAllRequest, GetByIdRequest, Paginator, User } from "./_shared";

export const protobufPackage = "learnio.user";

export interface Settings {
  notifications?: boolean | undefined;
  emails?: boolean | undefined;
}

export interface GetAllResponse {
  users: User[];
  paginator: Paginator | undefined;
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

export const LEARNIO_USER_PACKAGE_NAME = "learnio.user";

export interface UserServiceClient {
  getAll(request: GetAllRequest): Observable<GetAllResponse>;

  getById(request: GetByIdRequest): Observable<UserResponse>;

  updateById(request: UpdateRequest): Observable<UserResponse>;

  deleteById(request: GetByIdRequest): Observable<EmptyOrError>;

  changeImage(request: ChangeImageRequest): Observable<EmptyOrError>;

  getSettings(request: GetByIdRequest): Observable<GetSettingsResponse>;

  updateSettings(request: UpdateSettingsRequest): Observable<GetSettingsResponse>;

  changePermission(request: ChangePermissionRequest): Observable<EmptyOrError>;
}

export interface UserServiceController {
  getAll(request: GetAllRequest): Promise<GetAllResponse> | Observable<GetAllResponse> | GetAllResponse;

  getById(request: GetByIdRequest): Promise<UserResponse> | Observable<UserResponse> | UserResponse;

  updateById(request: UpdateRequest): Promise<UserResponse> | Observable<UserResponse> | UserResponse;

  deleteById(request: GetByIdRequest): Promise<EmptyOrError> | Observable<EmptyOrError> | EmptyOrError;

  changeImage(request: ChangeImageRequest): Promise<EmptyOrError> | Observable<EmptyOrError> | EmptyOrError;

  getSettings(
    request: GetByIdRequest,
  ): Promise<GetSettingsResponse> | Observable<GetSettingsResponse> | GetSettingsResponse;

  updateSettings(
    request: UpdateSettingsRequest,
  ): Promise<GetSettingsResponse> | Observable<GetSettingsResponse> | GetSettingsResponse;

  changePermission(request: ChangePermissionRequest): Promise<EmptyOrError> | Observable<EmptyOrError> | EmptyOrError;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getAll",
      "getById",
      "updateById",
      "deleteById",
      "changeImage",
      "getSettings",
      "updateSettings",
      "changePermission",
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
