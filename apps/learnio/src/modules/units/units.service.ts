import { DatabaseService } from "@database";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Injectable()
export class UnitsService {
    constructor(private readonly db: DatabaseService) { }

    async findAll(args: Prisma.UnitFindManyArgs) {
        if (args.take) {
            const count = await this.db.unit.count({ where: args.where });
            const currentPage = ((args.skip ?? 0) / args.take) + 1;
            const totalPages = Math.ceil(count / args.take);

            return {
                units: await this.db.unit.findMany(args),
                paginator: { count, currentPage, totalPages }
            }
        }

        return { units: await this.db.unit.findMany(args), paginator: undefined };
    }

    findOne(args: Prisma.UnitFindUniqueArgs) {
        return this.db.unit.findUnique(args);
    }

    async findOneOrThrow(args: Prisma.UnitFindUniqueArgs) {
        const unit = await this.db.unit.findUnique(args);

        if (!unit) {
            throw new NotFoundException('Unit is not found');
        }

        return unit;
    }

    async create(args: Prisma.UnitCreateArgs) {
        try {
            const unit = await this.db.unit.create(args);

            return unit;
        } catch (error) {
            this.db.throwHttpException(error);
        }
    }

    async update(args: Prisma.UnitUpdateArgs) {
        await this.findOneOrThrow({ where: args.where });

        try {
            const updated = await this.db.unit.update(args);

            return updated;
        } catch (error) {
            this.db.throwHttpException(error);
        }
    }

    async delete(args: Prisma.UnitDeleteArgs) {
        await this.findOneOrThrow({ where: args.where });

        try {
            await this.db.unit.delete(args);
        } catch (error) {
            this.db.throwHttpException(error);
        }
    }
}