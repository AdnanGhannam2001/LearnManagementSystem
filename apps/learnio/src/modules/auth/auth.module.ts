import { Global, Module } from "@nestjs/common";
import { AuthenticateGuard } from "./guard/authenticate.guard";
import { join } from "path";
import { RoleAuthorizeGuard } from "./guard/role-authorize.guard";
import { ClaimsAuthorizeGuard } from "./guard/claims-authorize.guard";
import { AuthClientModule } from "@common";
import { AuthService } from "./auth.service";

@Global()
@Module({
    imports: [
        AuthClientModule.register({
            global: true,
            protoPath: join(__dirname, "../../../libs/protobuf/proto/auth.proto")
        }),
    ],
    providers: [
        AuthService,
        AuthenticateGuard,
        RoleAuthorizeGuard,
        ClaimsAuthorizeGuard
    ],
    exports: [
        AuthService,
        AuthenticateGuard,
        RoleAuthorizeGuard,
        ClaimsAuthorizeGuard
    ],
})
export class AuthModule { }