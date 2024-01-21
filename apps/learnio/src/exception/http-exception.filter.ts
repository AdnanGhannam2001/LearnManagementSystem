import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const exc = exception.getResponse();

    const error = {};

    if (!exc['message'] && typeof exc == 'string') {
      error['message'] = [exc];
    } else if (exc['message'] && !Array.isArray(exc['message'])) {
      error['message'] = [exc['message']];
    }

    res
      .status(status)
      .render('partials/error', { error })
  }
}