import { DatabaseService } from '@database';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GetByIdRequest, EmptyOrError } from '@protobuf/_shared';
import { GetByIdResponse } from '@protobuf/application';
import { AskQuestionRequest, UpdateQuestionRequest } from '@protobuf/forum';

@Injectable()
export class ForumService {
  constructor(private readonly db: DatabaseService) { }

  async findAll(args: Prisma.QuestionFindManyArgs) {
    const questions = await this.db.question.findMany({
      ...args,
      include: {
        user: true,
        _count: { select: { comments: true, votes: true } }
      }
    });

    if (args.take) {
      const count = await this.db.question.count({ where: args.where });
      const currentPage = (args.skip ?? 0) / args.take + 1;
      const totalPages = Math.ceil(count / args.take);

      return {
        questions,
        paginator: { count, currentPage, totalPages },
      };
    }

    return { questions, paginator: undefined };
  }

  async findOneOrError(args: Prisma.QuestionFindUniqueArgs) {
    const question = await this.db.question.findUnique(args);

    if (!question) {
      return {
        error: {
          code: 404,
          message: 'Question is not found'
        }
      };
    }

    return { question };
  }

  async create(args: Prisma.QuestionCreateArgs) {
    try {
      const question = await this.db.question.create(args);

      return { question };
    } catch (error) {
      return {
        error: {
          code: 400,
          message: this.db.handle(error)
        }
      };
    }
  }

  async update(args: Prisma.QuestionUpdateArgs) {
    const question = await this.findOneOrError({ where: args.where });

    if (question.error) {
      return question.error;
    }

    try {
      const updated = await this.db.question.update(args);

      return updated;
    } catch (error) {
      return {
        error: {
          code: 400,
          message: this.db.handle(error)
        }
      };
    }
  }

  async delete(args: Prisma.QuestionDeleteArgs) {
    const question = await this.findOneOrError({ where: args.where });

    if (question.error) {
      return question.error;
    }

    try {
      await this.db.question.delete(args);
    } catch (error) {
      return {
        error: {
          code: 400,
          message: this.db.handle(error)
        }
      };
    }
  }
}
