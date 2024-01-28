import { Global, Module } from "@nestjs/common";
import { AuthenticateGuard } from "./guard/authenticate.guard";
import { join } from "path";
import { RoleAuthorizeGuard } from "./guard/role-authorize.guard";
import { ClaimsAuthorizeGuard } from "./guard/claims-authorize.guard";
import { AuthClientModule } from "@common";

@Global()
@Module({
    imports: [
        AuthClientModule.register({
            global: true,
            protoPath: join(__dirname, "../../../libs/protobuf/proto/auth.proto")
        }),
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