import { Global, Module } from "@nestjs/common";
import { AuthenticateGuard } from "./guard/authenticate.guard";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AUTH_SERVICE_NAME, LEARNIO_AUTH_PACKAGE_NAME } from "@protobuf/auth";
import { join } from "path";
import { RoleAuthorizeGuard } from "./guard/role-authorize.guard";
import { ClaimsAuthorizeGuard } from "./guard/claims-authorize.guard";

@Global()
@Module({
    imports: [
        ClientsModule.register([
            {
                name: AUTH_SERVICE_NAME,
                transport: Transport.GRPC,
                options: {
                    package: LEARNIO_AUTH_PACKAGE_NAME,
                    protoPath: join(__dirname, "../../../libs/protobuf/proto/auth.proto")
                }
            }
        ])
    ],
    providers: [
        AuthenticateGuard,
        RoleAuthorizeGuard,
        ClaimsAuthorizeGuard
    ],
    exports: [
        AuthenticateGuard,
        RoleAuthorizeGuard,
        ClaimsAuthorizeGuard
    ],
})
export class AuthModule { }