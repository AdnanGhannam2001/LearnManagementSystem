import { DatabaseService } from "@database";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Injectable()
export class RatesService {
    constructor(private readonly db: DatabaseService) { }

    async findAll(args: Prisma.RateFindManyArgs) {
        if (args.take) {
            const count = await this.db.rate.count({ where: args.where });
            const currentPage = ((args.skip ?? 0) / args.take) + 1;
            const totalPages = Math.ceil(count / args.take);

            return {
                rates: await this.db.rate.findMany(args),
                paginator: { count, currentPage, totalPages }
            }

        }

        return { rates: await this.db.rate.findMany(args), paginator: undefined }
    }

    async findOneOrThrow(args: Prisma.RateFindUniqueArgs) {
        const rate = await this.db.rate.findUnique(args);

        if (!rate) {
            throw new NotFoundException('Rate is not found');
        }

        return rate;
    }
    
    async create(args: Prisma.RateCreateArgs) {
        try {
            const rate = await this.db.rate.create(args);

            return rate;
        } catch (error) {
            this.db.throwHttpException(error);
        }
    }

    async delete(args: Prisma.RateDeleteArgs) {
        await this.findOneOrThrow({ where: args.where });

        try {
            await this.db.rate.delete(args);
        } catch (error) {
            this.db.throwHttpException(error);
        }
    }
}