import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AUTH_SERVICE_NAME, LEARNIO_AUTH_PACKAGE_NAME } from "@protobuf/auth";
import { join } from "path";
import { LocalStrategy } from "./strategy/local.strategy";

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
    controllers: [UsersController],
    providers: [
        UsersService,
        LocalStrategy
    ],
    exports: [
        UsersService,
        LocalStrategy
    ],
})
export class UsersModule { }