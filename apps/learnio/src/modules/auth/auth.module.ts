import { Global, Module } from "@nestjs/common";
import { AuthenticateGuard } from "./guard/authenticate.guard";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AUTH_SERVICE_NAME, LEARNIO_AUTH_PACKAGE_NAME } from "@protobuf/auth";
import { join } from "path";

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
    providers: [AuthenticateGuard],
    exports: [AuthenticateGuard]
})
export class AuthModule { }