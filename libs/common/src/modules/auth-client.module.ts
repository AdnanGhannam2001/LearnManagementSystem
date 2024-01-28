import { AUTH_SERVICE } from "@common/constants";
import { DynamicModule, Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { LEARNIO_AUTH_PACKAGE_NAME } from "@protobuf/auth";
import { join } from "path";

@Module({ })
export class AuthClientModule {
    static register(options?: { global: boolean, protoPath: string | string[] }): DynamicModule {
        return {
            module: AuthClientModule,
            global: options?.global,
            imports: [
                ClientsModule.register([
                    {
                        name: AUTH_SERVICE,
                        transport: Transport.GRPC,
                        options: {
                            package: LEARNIO_AUTH_PACKAGE_NAME,
                            protoPath: options.protoPath
                        }
                    }
                ])
            ],
            exports: [ClientsModule]
        };
    }
}