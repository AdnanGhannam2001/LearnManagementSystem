import { DatabaseService } from "@database";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Injectable()
export class LessonsService {
    constructor(private readonly db: DatabaseService) { }

    async findAll(args: Prisma.LessonFindManyArgs) {
        if (args.take) {
            const count = await this.db.lesson.count({ where: args.where });
            const currentPage = ((args.skip ?? 0) / args.take) + 1;
            const totalPages = Math.ceil(count / args.take);

            return {
                lessons: await this.db.lesson.findMany(args),
                paginator: { count, currentPage, totalPages }
            }
        }

        return { lessons: await this.db.lesson.findMany(args), paginator: undefined };
    }

    findOne(args: Prisma.LessonFindUniqueArgs) {
        return this.db.lesson.findUnique(args);
    }

    async findOneOrThrow(args: Prisma.LessonFindUniqueArgs) {
        const lesson = await this.db.lesson.findUnique(args);

        if (!lesson) {
            throw new NotFoundException('Lesson is not found');
        }

        return lesson;
    }

    async create(args: Prisma.LessonCreateArgs) {
        try {
            const lesson = await this.db.lesson.create(args);

            return lesson;
        } catch (error) {
            this.db.throwHttpException(error);
        }
    }

    async update(args: Prisma.LessonUpdateArgs) {
        await this.findOneOrThrow({ where: args.where });

        try {
            const updated = await this.db.lesson.update(args);

            return updated;
        } catch (error) {
            this.db.throwHttpException(error);
        }
    }

    async delete(args: Prisma.LessonDeleteArgs) {
        await this.findOneOrThrow({ where: args.where });

        try {
            await this.db.lesson.delete(args);
        } catch (error) {
            this.db.throwHttpException(error);
        }
    }
}