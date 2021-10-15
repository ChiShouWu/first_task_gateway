import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { status as RcpStatus } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcExceptionToHttpFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof HttpException) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const httpStatus = RpcStatusCodeTranform(exception['code']);

      if (!httpStatus || httpStatus === HttpStatus.INTERNAL_SERVER_ERROR)
        exception['details'] = 'Internal server error';

      response.status(httpStatus).json({
        status: httpStatus,
        error: exception['details'],
      });
    }
  }
}
function RpcStatusCodeTranform(rpcCode: RcpStatus): HttpStatus {
  interface TransformPair {
    [key: number]: HttpStatus;
  }
  const transfromPairs: TransformPair = {
    0: HttpStatus.OK,
    3: HttpStatus.BAD_REQUEST,
    4: HttpStatus.GATEWAY_TIMEOUT,
    5: HttpStatus.NOT_FOUND,
    6: HttpStatus.CONFLICT,
    7: HttpStatus.FORBIDDEN,
    8: HttpStatus.TOO_MANY_REQUESTS,
    9: HttpStatus.BAD_REQUEST,
    16: HttpStatus.UNAUTHORIZED,
    10: HttpStatus.CONFLICT,
    11: HttpStatus.BAD_REQUEST,
    12: HttpStatus.NOT_IMPLEMENTED,
    13: HttpStatus.INTERNAL_SERVER_ERROR,
    14: HttpStatus.SERVICE_UNAVAILABLE,
    15: HttpStatus.INTERNAL_SERVER_ERROR,
  };

  return transfromPairs[rpcCode]
    ? transfromPairs[rpcCode]
    : HttpStatus.INTERNAL_SERVER_ERROR;
}
