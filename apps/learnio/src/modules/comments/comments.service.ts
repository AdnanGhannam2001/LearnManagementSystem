import { DatabaseService } from "@database";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Injectable()
export class CommentsService {
    constructor(private readonly db: DatabaseService) { }

    async findAll(args: Prisma.CommentFindManyArgs) {
        if (args.take) {
            const count = await this.db.comment.count({ where: args.where });
            const currentPage = ((args.skip ?? 0) / args.take) + 1;
            const totalPages = Math.ceil(count / args.take);

            return {
                comments: await this.db.comment.findMany(args),
                paginator: { count, currentPage, totalPages }
            }
        }

        return { comments: await this.db.comment.findMany(args), paginator: undefined };
    }

    findOne(args: Prisma.CommentFindUniqueArgs) {
        return this.db.comment.findUnique(args);
    }

    async findOneOrThrow(args: Prisma.CommentFindUniqueArgs) {
        const comment = await this.db.comment.findUnique(args);

        if (!comment) {
            throw new NotFoundException(`Comment is not found`);
        }

        return comment;
    }

    async create(args: Prisma.CommentCreateArgs) {
        try {
            const comment = await this.db.comment.create(args);

            return comment;
        } catch (error) {
            this.db.throwHttpException(error);
        }
    }

    async update(args: Prisma.CommentUpdateArgs) {
        await this.findOneOrThrow({ where: args.where });

        try {
            const updated = await this.db.comment.update(args);

            return updated;
        } catch (error) {
            this.db.throwHttpException(error);
        }
    }

    async delete(args: Prisma.CommentDeleteArgs) {
        await this.findOneOrThrow({ where: args.where });

        try {
            await this.db.comment.delete(args);
        } catch (error) {
            this.db.throwHttpException(error);
        }
    }
}