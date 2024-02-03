import { HttpException, Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { GetAllRequest, GetByIdRequest } from "@protobuf/_shared";
import { AskQuestionRequest, FORUM_SERVICE_NAME, ForumServiceClient, GetAllQuestionsRequest, UpdateQuestionRequest } from "@protobuf/forum";
import { firstValueFrom } from "rxjs";

@Injectable()
export class ForumsService implements OnModuleInit {
    private service: ForumServiceClient;

    constructor(@Inject(FORUM_SERVICE_NAME) private readonly client: ClientGrpc) { }

    onModuleInit() {
        this.service = this.client.getService<ForumServiceClient>(FORUM_SERVICE_NAME);
    }

    getAll(request: GetAllQuestionsRequest) {
        return this.service.getAllQuestions(request);
    }

    async getOne(request: GetByIdRequest) {
        const response = await firstValueFrom(this.service.getQuestionById(request));

        if (response.error) {
            throw new HttpException(response.error, response.error.code);
        }

        return response.question;
    }

    async create(request: AskQuestionRequest) {
        const response = await firstValueFrom(this.service.askQuestion(request));

        if (response.error) {
            throw new HttpException(response.error, response.error.code);
        }

        return response.question;
    }

    async update(request: UpdateQuestionRequest) {
        const response = await firstValueFrom(this.service.updateQuestion(request));

        if (response.error) {
            throw new HttpException(response.error, response.error.code);
        }

        return response.question;
    }

    async delete(request: GetByIdRequest) {
        const response = await firstValueFrom(this.service.deleteQuestion(request));

        if (response.error) {
            throw new HttpException(response.error, response.error.code);
        }
    }
}