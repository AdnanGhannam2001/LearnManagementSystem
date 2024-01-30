import { HttpException, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaClientInitializationError, PrismaClientKnownRequestError, PrismaClientRustPanicError, PrismaClientUnknownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        await this.$connect();
    }

    handle(error: Error): string {
        if (error instanceof PrismaClientValidationError
            || error instanceof PrismaClientRustPanicError
            || error instanceof PrismaClientKnownRequestError
            || error instanceof PrismaClientUnknownRequestError
            || error instanceof PrismaClientInitializationError)
        {
            return error.message.split('\n').pop();
        } else {
            return `Something went wrong, please try again later`;
        }
    }

    throwHttpException(error: Error) {
        throw new HttpException(this.handle(error), 400);
    }
}
