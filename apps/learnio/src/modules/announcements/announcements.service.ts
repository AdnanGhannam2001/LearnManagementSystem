import { DatabaseService } from "@database";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Injectable()
export class AnnouncementsService {
    constructor(private readonly db: DatabaseService) { }

    async findAll(args: Prisma.AnnouncementFindManyArgs) {
        if (args.take) {
            const count = await this.db.announcement.count({ where: args.where });
            const currentPage = ((args.skip ?? 0) / args.take) + 1;
            const totalPages = Math.ceil(count / args.take);

            return {
                announcements: await this.db.announcement.findMany(args),
                paginator: { count, currentPage, totalPages }
            }
        }

        return { announcements: await this.db.announcement.findMany(args), paginator: undefined };
    }

    async findOneOrThrow(args: Prisma.AnnouncementFindUniqueArgs) {
        const announcement = await this.db.announcement.findUnique(args);

        if (!announcement) {
            throw new NotFoundException('Announcement is not found');
        }

        return announcement;
    }

    async create(args: Prisma.AnnouncementCreateArgs) {
        try {
            const announcement = await this.db.announcement.create(args);

            return announcement;
        } catch (error) {
            this.db.throwHttpException(error);
        }
    }

    async update(args: Prisma.AnnouncementUpdateArgs) {
        await this.findOneOrThrow({ where: args.where });

        try {
            const updated = await this.db.announcement.update(args);

            return updated;
        } catch (error) {
            this.db.throwHttpException(error);
        }
    }

    async delete(args: Prisma.AnnouncementDeleteArgs) {
        await this.findOneOrThrow({ where: args.where });

        try {
            await this.db.announcement.delete(args);
        } catch (error) {
            this.db.throwHttpException(error);
        }
    }
}