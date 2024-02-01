import { DatabaseService } from "@database";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Injectable()
export class CoachesService {
    constructor(private readonly db: DatabaseService) { }

    async findAll(args: Prisma.CoachFindManyArgs) {
        if (args.take) {
            const count = await this.db.course.count({ where: args.where });
            const currentPage = ((args.skip ?? 0) / args.take) + 1;
            const totalPages = Math.ceil(count / args.take);

            return {
                coaches: await this.db.coach.findMany(args),
                paginator: { count, currentPage, totalPages }
            }
        }

        return { coaches: await this.db.coach.findMany(args), paginator: undefined };
    }

    findOne(args: Prisma.CoachFindUniqueArgs) {
        return this.db.coach.findUnique(args);
    }

    async findOneOrThrow(args: Prisma.CoachFindUniqueArgs) {
        const coach = await this.db.coach.findUnique(args);

        if (!coach) {
            throw new NotFoundException('Coach not found');
        }

        return coach;
    }

    async create(args: Prisma.CoachCreateArgs) {
        try {
            const coach = await this.db.coach.create(args);

            return coach;
        } catch (error) {
            this.db.throwHttpException(error);
        }
    }

    async delete(args: Prisma.CoachDeleteArgs) {
        await this.findOneOrThrow({ where: args.where });

        try {
            await this.db.coach.delete(args);
        } catch (error) {
            this.db.throwHttpException(error);
        }
    }
}