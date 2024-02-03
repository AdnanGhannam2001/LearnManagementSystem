import { Permissions, PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { createHash } from "crypto";
import { NOA, NOC, NOM, NOU } from "./index";

const seed = async () => {
    const db = new PrismaClient();

    await db.user.deleteMany();

    const getData = (permission: Permissions = 'NormalUser') => ({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        bio: faker.person.bio(),
        password: createHash("sha256").update("A@1234567890").digest("hex"),
        permission,
        isActivated: true,
        settings: { create: { } },
        ...(permission == 'NormalUser' ? { cart: { create: { } } } : {})
    });

    for (let i = 0; i < NOU; i++) {
        await db.user.create({ data: getData() });
    }

    for (let i = 0; i < NOC; i++) {
        await db.user.create({ data: getData('Coach') });
    }

    for (let i = 0; i < NOM; i++) {
        await db.user.create({ data: getData('Moderator') });
    }

    for (let i = 0; i < NOA; i++) {
        await db.user.create({ data: getData('Admin') });
    }

    await db.user.create({ data: getData('Root') });
    
    return "Users were seeded";
};

seed()
    .then(console.info)
    .catch((err: Error) => 
            console.error(`An error occure when seeding 'Users' to the database\nMessage: ${err}`));