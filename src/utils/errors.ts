import { HttpException, HttpStatus } from '@nestjs/common';

export const bad_request = (message?: string) =>
  new HttpException(
    {
      status: HttpStatus.BAD_REQUEST,
      error: message ?? 'BAD_REQUEST',
    },
    HttpStatus.BAD_REQUEST
  );

export const unauthorized = (message?: string) =>
  new HttpException(
    {
      status: HttpStatus.UNAUTHORIZED,
      error: message ?? 'UNAUTHORIZED',
    },
    HttpStatus.UNAUTHORIZED
  );

export const authorization_failed = (message?: string) =>
  new HttpException(
    {
      status: HttpStatus.BAD_REQUEST,
      error: message ?? 'AUTHORIZATION_FAILED',
    },
    HttpStatus.BAD_REQUEST
  );

export const access_token_expired_signature = (message?: string) =>
  new HttpException(
    {
      status: HttpStatus.FORBIDDEN,
      error: message ?? 'ACCESS_TOKEN_EXPIRED',
    },
    HttpStatus.FORBIDDEN
  );

export const refresh_token_expired_signature = (message?: string) =>
  new HttpException(
    {
      status: 419,
      error: message ?? 'REFRESH_TOKEN_EXPIRED',
    },
    419
  );
