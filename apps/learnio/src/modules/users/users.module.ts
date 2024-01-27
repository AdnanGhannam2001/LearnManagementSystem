import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { LEARNIO_AUTH_PACKAGE_NAME } from "@protobuf/auth";
import { join } from "path";
import { LocalStrategy } from "./strategy/local.strategy";
import { LEARNIO_USER_PACKAGE_NAME } from "@protobuf/user";
import { AUTH_SERVICE } from "../../constants";
import { UsersApiController } from "./users-api.controller";
import { LEARNIO_APPLICATION_PACKAGE_NAME } from "@protobuf/application";

@Module({
    imports: [
        ClientsModule.register([
            {
                name: AUTH_SERVICE,
                transport: Transport.GRPC,
                options: {
                    package: [
                        LEARNIO_AUTH_PACKAGE_NAME,
                        LEARNIO_USER_PACKAGE_NAME,
                        LEARNIO_APPLICATION_PACKAGE_NAME
                    ],
                    protoPath: [
                        join(__dirname, "../../../libs/protobuf/proto/auth.proto"),
                        join(__dirname, "../../../libs/protobuf/proto/user.proto"),
                        join(__dirname, "../../../libs/protobuf/proto/application.proto")
                    ]
                }
            }
        ])
    ],
    controllers: [
        UsersController,
        UsersApiController
    ],
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