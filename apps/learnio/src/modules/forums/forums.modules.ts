import { Module } from "@nestjs/common";
import { ForumsController } from "./forums.controller";
import { ForumsService } from "./forums.service";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { FORUM_SERVICE_NAME, LEARNIO_FORUM_PACKAGE_NAME } from "@protobuf/forum";
import { join } from "path";

@Module({
    imports: [
        ClientsModule.register([
            {
                name: FORUM_SERVICE_NAME,
                transport: Transport.GRPC,
                options: {
                    url: '0.0.0.0:5001',
                    package: LEARNIO_FORUM_PACKAGE_NAME,
                    protoPath: join(__dirname, "../../../libs/protobuf/proto/forum.proto")
                }
            }
        ])
    ],
    controllers: [ForumsController],
    providers: [ForumsService],
    exports: [ForumsService]
})
export class ForumsModule { }