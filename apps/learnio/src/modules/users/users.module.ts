import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { LocalStrategy } from "./strategy/local.strategy";
import { UsersApiController } from "./users-api.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { LEARNIO_AUTH_PACKAGE_NAME } from "@protobuf/auth";
import { LEARNIO_USER_PACKAGE_NAME } from "@protobuf/user";
import { LEARNIO_APPLICATION_PACKAGE_NAME } from "@protobuf/application";
import { join } from "path";
import { USER_AUTH_SERVICE } from "../../constants";

@Module({
    imports: [
        ClientsModule.register([
            {
                name: USER_AUTH_SERVICE,
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