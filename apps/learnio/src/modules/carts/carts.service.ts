import { DatabaseService } from "@database";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Injectable()
export class CartsService {
    constructor(private readonly db: DatabaseService) { }

    findOne(args: Prisma.CartFindUniqueArgs) {
        return this.db.cart.findUnique(args);
    }

    async update(args: Prisma.CartUpdateArgs) {
        try {
            const updated = await this.db.cart.update(args);
            return updated;
        } catch (error) {
            
        }
    }
}