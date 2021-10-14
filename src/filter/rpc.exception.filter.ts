import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';
import { status } from '@grpc/grpc-js';

@Catch(RpcException)
export class RpcExceptionToHttpFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const err = exception.getError();
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.send({
      code: RpcStatusCodeTranform(err['code']),
      message: err['details'],
    });
  }
}

export function RpcStatusCodeTranform(rpcCode: status): HttpStatus {
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
