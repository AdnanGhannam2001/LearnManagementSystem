import { UseGuards, applyDecorators } from "@nestjs/common";
import { Permissions } from "@prisma/client";
import { RequiredPermissions } from "./required-permissions.decorator";
import { RoleAuthorizeGuard } from "../guard/role-authorize.guard";

export const RoleAuthorize =
    (permissions: Permissions[]) => 
        (applyDecorators(
            RequiredPermissions(permissions),
            UseGuards(RoleAuthorizeGuard)
        ));