import { DynamicModule, Module } from '@nestjs/common';
import { RmqService } from './rmq.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  providers: [RmqService],
  exports: [RmqService],
})
export class RmqModule {
  static register(name: string): DynamicModule {
    return {
      module: RmqModule,
      global: true,
      imports: [
        ClientsModule.register([
          {
            name,
            transport: Transport.RMQ,
            options: {
              queue: `LEARN_IO_${name}_QUEUE`,
              urls: ['amqp://localhost:5672']
            }
          }
        ])
      ],
      exports: [ClientsModule]
    }
  }
}
