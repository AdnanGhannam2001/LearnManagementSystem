import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const error = exception.getResponse();

    if ([HttpStatus.FORBIDDEN, HttpStatus.UNAUTHORIZED].includes(status)) {
      return res.status(status).redirect('/forbidden');
    }

    return res
      .status(status)
      .render('partials/error', { error });
  }
}