import { Controller } from "@nestjs/common";
import { GetAllRequest, GetByIdRequest, EmptyOrError } from "@protobuf/_shared";
import { ApplicationServiceController, ApplicationServiceControllerMethods, GetAllResponse, GetByIdResponse, RespondRequest, SendRequest } from "@protobuf/application";
import { ApplicationsService } from "./applications.service";
import { ApplyRequestStatus } from "@prisma/client";

@Controller() 
@ApplicationServiceControllerMethods()
export class ApplicationsController implements ApplicationServiceController {
    constructor(private readonly service: ApplicationsService) { }

    getAll(request: GetAllRequest) {
        return this.service.findAll({
            where: {
                OR: [
                    {
                        details: {
                            contains: request.search,
                            mode: 'insensitive'
                        }
                    },
                    {
                        response: {
                            contains: request.search,
                            mode: 'insensitive'
                        }
                    }
                ]
            },
            include: { user: true },
            skip: request.skip,
            take: request.pageSize ?? 20,
            orderBy:  { sentAt: request.desc ? 'desc' : 'asc' }
        });
    }

    getById(request: GetByIdRequest) {
        return this.service.findOneOrError({
            where: { userId: request.id },
            include: { user: true }
        });
    }

    send(request: SendRequest) {
        return this.service.create({
            data: {
                user: { connect: { id: request.userId } },
                details: request.details
            }
        });
    }

    respond(request: RespondRequest) {
        return this.service.update({
            where: { userId: request.id },
            data: {
                status: ApplyRequestStatus[request.status],
                response: request.response
            }
        });
    }
}