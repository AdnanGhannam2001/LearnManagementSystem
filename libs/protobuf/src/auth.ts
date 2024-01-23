/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { EmptyOrError, Error } from "./_shared";

export const protobufPackage = "learnio.auth";

export enum Action {
  CREATE = 0,
  READ = 1,
  UPDATE = 2,
  DELETE = 3,
  UNRECOGNIZED = -1,
}

export enum ObjectType {
  USER = 0,
  NOTIFICATION = 1,
  SETTINGS = 2,
  APPLY_REQUEST = 3,
  COURSE = 4,
  UNIT = 5,
  LESSON = 6,
  FOLDER = 7,
  FILE = 8,
  QUIZ_QUESTION = 9,
  CHOISE = 10,
  COMMENT = 11,
  VOTE = 12,
  CHAT = 13,
  MESSAGE = 14,
  RESOURCE = 15,
  CART = 16,
  ROLLED = 17,
  PAYMENT = 18,
  MEMBER = 19,
  DONE = 20,
  RATE = 21,
  QUESTION = 22,
  ANNOUNCEMENT = 23,
  UNRECOGNIZED = -1,
}

export interface User {
  id: string;
  name: string;
  email: string;
  permission: string;
  isActivated: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  success?: RegisterResponse_Success | undefined;
  error?: Error | undefined;
}

export interface RegisterResponse_Success {
  email: string;
  activateCode: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface VerifyEmailResponse {
  error?: Error | undefined;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string | undefined;
  error?: Error | undefined;
}

export interface ChangePasswordRequest {
  id: string;
  newPassword: string;
  password?: string | undefined;
  resetCode?: string | undefined;
}

export interface AuthenticateRequest {
  token: string;
}

export interface AuthenticateResponse {
  user?: User | undefined;
  error?: Error | undefined;
}

export interface RoleAuthorizeRequest {
  user: User | undefined;
  requiredPermissions: string[];
}

export interface ClaimsAuthorizeRequest {
  user: User | undefined;
  objectId: string;
  objectType: ObjectType;
  action: Action;
}

export interface AuthorizeResponse {
  allowed?: boolean | undefined;
  error?: Error | undefined;
}

export const LEARNIO_AUTH_PACKAGE_NAME = "learnio.auth";

export interface AuthServiceClient {
  register(request: RegisterRequest): Observable<RegisterResponse>;

  verifyEmail(request: VerifyEmailRequest): Observable<VerifyEmailResponse>;

  login(request: LoginRequest): Observable<LoginResponse>;

  changePassword(request: ChangePasswordRequest): Observable<EmptyOrError>;

  authenticate(request: AuthenticateRequest): Observable<AuthenticateResponse>;

  roleAuthorize(request: RoleAuthorizeRequest): Observable<AuthorizeResponse>;

  claimsAuthorize(request: ClaimsAuthorizeRequest): Observable<AuthorizeResponse>;
}

export interface AuthServiceController {
  register(request: RegisterRequest): Promise<RegisterResponse> | Observable<RegisterResponse> | RegisterResponse;

  verifyEmail(
    request: VerifyEmailRequest,
  ): Promise<VerifyEmailResponse> | Observable<VerifyEmailResponse> | VerifyEmailResponse;

  login(request: LoginRequest): Promise<LoginResponse> | Observable<LoginResponse> | LoginResponse;

  changePassword(request: ChangePasswordRequest): Promise<EmptyOrError> | Observable<EmptyOrError> | EmptyOrError;

  authenticate(
    request: AuthenticateRequest,
  ): Promise<AuthenticateResponse> | Observable<AuthenticateResponse> | AuthenticateResponse;

  roleAuthorize(
    request: RoleAuthorizeRequest,
  ): Promise<AuthorizeResponse> | Observable<AuthorizeResponse> | AuthorizeResponse;

  claimsAuthorize(
    request: ClaimsAuthorizeRequest,
  ): Promise<AuthorizeResponse> | Observable<AuthorizeResponse> | AuthorizeResponse;
}

export function AuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "register",
      "verifyEmail",
      "login",
      "changePassword",
      "authenticate",
      "roleAuthorize",
      "claimsAuthorize",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AUTH_SERVICE_NAME = "AuthService";
