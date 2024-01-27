import { DatabaseService } from "@database";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Injectable()
export class ApplicationsService {
    constructor(private readonly db: DatabaseService) { }

    async create(args: Prisma.ApplyRequestCreateArgs) {
        try {
            await this.db.applyRequest.create(args);
        } catch (error) {
            return {
                error: {
                    code: 400,
                    message: this.db.handle(error)
                }
            }
        }
    }
    
    async findAll(args: Prisma.ApplyRequestFindManyArgs) {
        if (args.take) {
            const count = await this.db.user.count({ where: args.where });
            const currentPage = ((args.skip ?? 0) / args.take) + 1;
            const totalPages = Math.ceil(count / args.take);

            return {
                applications: await this.db.applyRequest.findMany(args),
                paginator: { count, currentPage, totalPages }
            }
        }

        return { applications: await this.db.applyRequest.findMany(args), paginator: undefined };
    }

    findOne(args: Prisma.ApplyRequestFindUniqueArgs) {
        return this.db.applyRequest.findUnique(args);
    }

    async findOneOrError(args: Prisma.ApplyRequestFindUniqueArgs) {
        const application = await this.db.applyRequest.findUnique(args);

        if (!application) {
            return {
                error: {
                    code: 404,
                    message: `Application is not found`
                }
            };
        }

        return { application };
    }

    async update(args: Prisma.ApplyRequestUpdateArgs) {
        try {
            await this.db.applyRequest.update(args);
        } catch (error) {
            return {
                error: {
                    code: 400,
                    message: this.db.handle(error)
                }
            }
        }
    }
    
}