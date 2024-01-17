import { DatabaseService } from "@database";
import { Injectable, NotFoundException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { Prisma } from "@prisma/client";
import { status as grpcStatus } from '@grpc/grpc-js';

@Injectable()
export class UsersService {
    constructor(private readonly db: DatabaseService) { }

    async findAll(args: Prisma.UserFindManyArgs) {
        if (args.take) {

            return {
                data: await this.db.user.findMany(args),
                count: await this.db.user.count({ where: args.where })
            }
        }

        return this.db.user.findMany(args);
    }

    findOne(args: Prisma.UserFindUniqueArgs) {
        return this.db.user.findUnique(args);
    }

    async findOneOrThrow(args: Prisma.UserFindUniqueArgs) {
        const user = await this.db.user.findUnique(args);
        
        if (!user) {
            throw new RpcException({
                code: grpcStatus.NOT_FOUND,
                message: "User not found"
            });
        }

        return user;
    }

    async create(args: Prisma.UserCreateArgs) {
        try {
            const user = await this.db.user.create(args);

            return user;
        } catch (error) { this.db.handle(error) }
    }

    async update(args: Prisma.UserUpdateArgs) {
        await this.findOneOrThrow(args);

        try {
            const user = await this.db.user.update(args);

            return user;
        } catch (error) { this.db.handle(error) }
    }

    async delete(args: Prisma.UserDeleteArgs) {
        await this.findOneOrThrow(args);

        try {
            await this.db.user.delete(args);
        } catch (error) { this.db.handle(error) }
    }
}