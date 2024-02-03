import { Controller } from '@nestjs/common';
import { ForumService } from './forum.service';
import { AskQuestionRequest, ForumServiceController, ForumServiceControllerMethods, GetAllQuestionsRequest, GetByIdResponse, UpdateQuestionRequest } from '@protobuf/forum';
import { GetByIdRequest, EmptyOrError } from '@protobuf/_shared';

@Controller()
@ForumServiceControllerMethods()
export class ForumController implements ForumServiceController {
  constructor(private readonly service: ForumService) {}
  
  getAllQuestions(request: GetAllQuestionsRequest) {
    return this.service.findAll({
      where: {
        forumId: request.forumId,
        OR: [
          {
            title: {
              contains: request.search,
              mode: 'insensitive',
            }
          },
          {
            content: {
              contains: request.search,
              mode: 'insensitive',
            }
          }
        ]
      },
      skip: request.skip,
      take: request.pageSize ?? 20,
      orderBy: { askedAt: request.desc ? 'desc' : 'asc' },
    });
  }

  getQuestionById(request: GetByIdRequest) {
    return this.service.findOneOrError({
      where: { id: request.id },
      include: { user: true }
    }) as GetByIdResponse;
  }

  askQuestion(request: AskQuestionRequest) {
    return this.service.create({
      data: { ...request },
      include: { user: true }
    }) as GetByIdResponse;
  }

  updateQuestion(request: UpdateQuestionRequest) {
    const { id } = request;
    delete request.id;

    return this.service.update({
      where: { id },
      data: { ...request }
    }) as GetByIdResponse;
  }

  deleteQuestion(request: GetByIdRequest) {
    return this.service.delete({
      where: { id: request.id }
    }) as EmptyOrError;
  }
}
