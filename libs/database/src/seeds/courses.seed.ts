import { PrismaClient, User } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { NOC, NOU } from "./index";

const pickRandom = <T>(array: T[], min: number = 5, max: number = 10) => {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;

  return array.sort(() => Math.random() - 0.5)
    .slice(0, count);
}

const seed = async () => {
    const db = new PrismaClient();

    await db.course.deleteMany();

    const users = await db.user.findMany({ where: { permission: 'NormalUser' }});
    const coaches = await db.user.findMany({ where: { permission: 'Coach' }});

    const coursesIds: string[] = [];
    const unitsIds: string[] = [];
    const lessonsIds: string[] = [];

    for (let i = 0; i < 50; i++) {
        const { id } = await db.course.create({
            data: {
                creator: { connect: coaches[i % NOC] },
                title: faker.word.words({ count: { min: 1, max: 5 } }),
                brief: faker.lorem.sentence(),
                about: [faker.lorem.sentences(2), faker.lorem.sentences(3)],
                video: faker.internet.url(),
                image: faker.image.url(),
                requirements: [faker.word.words({ count: 10 }), faker.word.words({ count: 10 })],
                description: faker.lorem.paragraph(),
                students: {
                    create: pickRandom(users).map(u => {
                        return { user: { connect: u } }
                    })
                },
                coaches: {
                    create: pickRandom(coaches).map(u => {
                        return { user: { connect: u } }
                    })
                },
                categories: {
                    connectOrCreate: [faker.hacker.noun(), faker.hacker.noun()].map(item => ({
                        where: { label: item },
                        create: { label: item }
                    }))
                },
                languages: {
                    connectOrCreate: {
                        where: { name: 'english' },
                        create: { name: 'english' }
                    }
                }
            }
        });

        coursesIds.push(id);
    }

    for (let courseId of coursesIds) {
        for (let i = 0; i < 3; i++) {
            const { id } = await db.unit.create({
                data: {
                    courseId,
                    title: faker.word.words({ count: { min: 1, max: 5 } }),
                    about: faker.lorem.sentence(),
                    order: i
                }
            });

            unitsIds.push(id);
        }
    }

    for (let unitId of unitsIds) {
        for (let i = 0; i < 3; i++) {
            const { id } = await db.lesson.create({
                data: {
                    unitId,
                    title: faker.word.words({ count: { min: 1, max: 5 } }),
                    about: faker.lorem.sentence(),
                    order: i,
                    type: "Txt",
                    content: faker.lorem.paragraph()
                }
            });

            lessonsIds.push(id);
        }
    }

    // TODO: generate comments 
    // for (let lessonId of lessonsIds) { }

    return "Courses were seeded";
};

seed()
    .then(console.info)
    .catch((err: Error) => 
            console.error(`An error occure when seeding 'Courses' to the database\nMessage: ${err}`));
