import { Controller } from "@nestjs/common";
import { GetAllRequest, GetByIdRequest } from "@protobuf/_shared";
import { ChangeImageRequest, ChangePermissionRequest, UpdateRequest, UpdateSettingsRequest, UserServiceController, UserServiceControllerMethods } from "@protobuf/user";
import { UsersService } from "./users.service";
import { Permissions } from "@prisma/client";

@Controller()
@UserServiceControllerMethods()
export class UsersController implements UserServiceController {
    constructor(private readonly service: UsersService) { }

    getAll(request: GetAllRequest) {
        return this.service.findAll({
            where: {
                name: {
                    contains: request.search,
                    mode: 'insensitive'
                }
            },
            skip: request.skip,
            take: request.pageSize ?? 20,
            orderBy:  { name: request.desc ? 'desc' : 'asc' }
        });
    }

    getById(request: GetByIdRequest) {
        return this.service.findOneOrError({ where: { id: request.id } });
    }

    updateById(request: UpdateRequest) {
        return this.service.update({
            where: { id: request.id },
            data: {
                ...(request.name ? { name: request.name } : {}),
                ...(request.bio ? { bio: request.bio } : {})
            }
        });
    }

    deleteById(request: GetByIdRequest) {
        return this.service.delete({ where: { id: request.id } });
    }

    changeImage(request: ChangeImageRequest) {
        return this.service.update({
            where: { id: request.id },
            data: { image: request.url }
        });
    }

    getSettings(request: GetByIdRequest) {
        return this.service.getSettingsOrError({ where: { userId: request.id } });
    }

    updateSettings(request: UpdateSettingsRequest) {
        return this.service.updateSettings({
            where: { userId: request.id },
            data: { ...request.settings }
        });
    }

    changePermission(request: ChangePermissionRequest) {
        return this.service.update({
            where: { id: request.id },
            data: { permission: Permissions[request.permission] }
        });
    }
}
