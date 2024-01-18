import { SetMetadata } from "@nestjs/common";
import { Permissions } from "@prisma/client";

export const REQUIRED_PERMISSIONS = "RequiredPermissions";
export const RequiredPermissions =
    (permissions: Permissions[]) => SetMetadata(REQUIRED_PERMISSIONS, permissions);