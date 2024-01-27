/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { EmptyOrError, Error, GetAllRequest, GetByIdRequest, Paginator, User } from "./_shared";

export const protobufPackage = "learnio.application";

export interface Application {
  user?: User | undefined;
  userId?: string | undefined;
  details: string;
  status: string;
  response: string;
}

export interface GetAllResponse {
  applications: Application[];
  paginator: Paginator | undefined;
}

export interface GetByIdResponse {
  application?: Application | undefined;
  error?: Error | undefined;
}

export interface SendRequest {
  userId: string;
  details: string;
}

export interface RespondRequest {
  id: string;
  status: string;
  response: string;
}

export const LEARNIO_APPLICATION_PACKAGE_NAME = "learnio.application";

export interface ApplicationServiceClient {
  getAll(request: GetAllRequest): Observable<GetAllResponse>;

  getById(request: GetByIdRequest): Observable<GetByIdResponse>;

  send(request: SendRequest): Observable<EmptyOrError>;

  respond(request: RespondRequest): Observable<EmptyOrError>;
}

export interface ApplicationServiceController {
  getAll(request: GetAllRequest): Promise<GetAllResponse> | Observable<GetAllResponse> | GetAllResponse;

  getById(request: GetByIdRequest): Promise<GetByIdResponse> | Observable<GetByIdResponse> | GetByIdResponse;

  send(request: SendRequest): Promise<EmptyOrError> | Observable<EmptyOrError> | EmptyOrError;

  respond(request: RespondRequest): Promise<EmptyOrError> | Observable<EmptyOrError> | EmptyOrError;
}

export function ApplicationServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getAll", "getById", "send", "respond"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("ApplicationService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("ApplicationService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const APPLICATION_SERVICE_NAME = "ApplicationService";
