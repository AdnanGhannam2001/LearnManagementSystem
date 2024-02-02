/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { EmptyOrError, Error, GetAllRequest, GetByIdRequest, Paginator, User } from "./_shared";

export const protobufPackage = "learnio.forum";

export interface Question {
  id: string;
  title: string;
  content: string;
  user: User | undefined;
  forumId: string;
}

export interface GetAllResponse {
  questions: Question[];
  paginator: Paginator | undefined;
}

export interface GetByIdResponse {
  question?: Question | undefined;
  error?: Error | undefined;
}

export interface AskQuestionRequest {
  title: string;
  content: string;
  userId: string;
  forumId: string;
}

export interface UpdateQuestionRequest {
  id: string;
  title?: string | undefined;
  content?: string | undefined;
}

export const LEARNIO_FORUM_PACKAGE_NAME = "learnio.forum";

export interface ForumServiceClient {
  getAllQuestions(request: GetAllRequest): Observable<GetAllResponse>;

  getQuestionById(request: GetByIdRequest): Observable<GetByIdResponse>;

  askQuestion(request: AskQuestionRequest): Observable<GetByIdResponse>;

  updateQuestion(request: UpdateQuestionRequest): Observable<GetByIdResponse>;

  deleteQuestion(request: GetByIdRequest): Observable<EmptyOrError>;
}

export interface ForumServiceController {
  getAllQuestions(request: GetAllRequest): Promise<GetAllResponse> | Observable<GetAllResponse> | GetAllResponse;

  getQuestionById(request: GetByIdRequest): Promise<GetByIdResponse> | Observable<GetByIdResponse> | GetByIdResponse;

  askQuestion(request: AskQuestionRequest): Promise<GetByIdResponse> | Observable<GetByIdResponse> | GetByIdResponse;

  updateQuestion(
    request: UpdateQuestionRequest,
  ): Promise<GetByIdResponse> | Observable<GetByIdResponse> | GetByIdResponse;

  deleteQuestion(request: GetByIdRequest): Promise<EmptyOrError> | Observable<EmptyOrError> | EmptyOrError;
}

export function ForumServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getAllQuestions",
      "getQuestionById",
      "askQuestion",
      "updateQuestion",
      "deleteQuestion",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("ForumService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("ForumService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const FORUM_SERVICE_NAME = "ForumService";
