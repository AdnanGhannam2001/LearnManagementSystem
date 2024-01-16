import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { createHash } from "crypto";

const seed = async () => {
    const db = new PrismaClient();

    for (let i = 0; i < 30; i++) {
        await db.user.create({
            data: {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                bio: faker.person.bio(),
                password: createHash("sha256").update("A@1234567890").digest("hex"),
                isActivated: true,
                settings: { create: { } },
                cart: { create: { } }
            }
        });
    }
    
    return "Users were seeded";
};

seed()
    .then(console.info)
    .catch((err: Error) => 
            console.error(`An error occure when seeding 'Users' to the database\nMessage: ${err}`));