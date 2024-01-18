/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { Error } from "./_shared";

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

export interface AuthenticateRequest {
  token: string;
}

export interface RoleAuthorizeRequest {
  token: string;
  requiredPermissions: string[];
}

export interface ClaimsAuthorizeRequest {
  token: string;
  objectId: string;
  objectType: ObjectType;
  action: Action;
}

export interface AuthResponse {
  allowed?: boolean | undefined;
  error?: Error | undefined;
}

export const LEARNIO_AUTH_PACKAGE_NAME = "learnio.auth";

export interface AuthServiceClient {
  register(request: RegisterRequest): Observable<RegisterResponse>;

  verifyEmail(request: VerifyEmailRequest): Observable<VerifyEmailResponse>;

  login(request: LoginRequest): Observable<LoginResponse>;

  authenticate(request: AuthenticateRequest): Observable<AuthResponse>;

  roleAuthorize(request: RoleAuthorizeRequest): Observable<AuthResponse>;

  claimsAuthorize(request: ClaimsAuthorizeRequest): Observable<AuthResponse>;
}

export interface AuthServiceController {
  register(request: RegisterRequest): Promise<RegisterResponse> | Observable<RegisterResponse> | RegisterResponse;

  verifyEmail(
    request: VerifyEmailRequest,
  ): Promise<VerifyEmailResponse> | Observable<VerifyEmailResponse> | VerifyEmailResponse;

  login(request: LoginRequest): Promise<LoginResponse> | Observable<LoginResponse> | LoginResponse;

  authenticate(request: AuthenticateRequest): Promise<AuthResponse> | Observable<AuthResponse> | AuthResponse;

  roleAuthorize(request: RoleAuthorizeRequest): Promise<AuthResponse> | Observable<AuthResponse> | AuthResponse;

  claimsAuthorize(request: ClaimsAuthorizeRequest): Promise<AuthResponse> | Observable<AuthResponse> | AuthResponse;
}

export function AuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "register",
      "verifyEmail",
      "login",
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
