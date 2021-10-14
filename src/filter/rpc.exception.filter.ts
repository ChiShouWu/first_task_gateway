import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

@Catch(RpcException)
export class RpcExceptionToHttpFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const err = exception.getError();
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.send({
      code: err['code'],
      message: err['details'],
    });
    // throw new HttpException(err['details'], err['code']);
    // return response.status(err['code']).json({
    //   message: err['details'],
    //   code: err['code'],
    // });
    // throw new HttpException(er);
  }
}
