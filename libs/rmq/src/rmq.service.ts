import { Injectable } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class RmqService {
    static configurations(name: string, noAck: boolean = false): MicroserviceOptions {
        return {
            transport: Transport.RMQ,
            options: {
              queue: `LEARN_IO_${name}_QUEUE`,
              urls: ['amqp://localhost:5672'],
              noAck
            }
        }
    }
}
