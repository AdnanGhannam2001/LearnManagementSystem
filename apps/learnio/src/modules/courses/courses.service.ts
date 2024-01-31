import { DatabaseService } from "@database";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Injectable()
export class CoursesService {
    constructor(private readonly db: DatabaseService) { }

    async findAll(args: Prisma.CourseFindManyArgs) {
        if (args.take) {
            const count = await this.db.course.count({ where: args.where });
            const currentPage = ((args.skip ?? 0) / args.take) + 1;
            const totalPages = Math.ceil(count / args.take);

            return {
                courses: await this.db.course.findMany(args),
                paginator: { count, currentPage, totalPages }
            }
        }

        return { courses: await this.db.course.findMany(args), paginator: undefined };
    }

    findOne(args: Prisma.CourseFindUniqueArgs) {
        return this.db.course.findUnique(args);
    }

    async findOneOrThrow(args: Prisma.CourseFindUniqueArgs) {
        const course = await this.db.course.findUnique(args);

        if (!course) {
            throw new NotFoundException('Course is not found');
        }

        return course;
    }

    async create(args: Prisma.CourseCreateArgs) {
        try {
            const course = await this.db.course.create(args);

            return course;
        } catch (error) {
            this.db.throwHttpException(error);
        }
    }

    async update(args: Prisma.CourseUpdateArgs) {
        await this.findOneOrThrow({ where: args.where });

        try {
            const updated = await this.db.course.update(args);

            return updated;
        } catch (error) {
            this.db.throwHttpException(error);
        }
    }

    async delete(args: Prisma.CourseDeleteArgs) {
        await this.findOneOrThrow({ where: args.where });

        try {
            await this.db.course.delete(args);
        } catch (error) {
            this.db.throwHttpException(error);
        }
    }
}