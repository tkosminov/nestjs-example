import { HttpException } from '@nestjs/common';

export const throwUNAUTHORIZED = (msg: string | null = null) => {
  throw new HttpException(
    {
      status: 401,
      error: msg || 'UNAUTHORIZED',
    },
    401
  );
};

export const throwJWTEXPIRED = (msg: string | null = null) => {
  throw new HttpException(
    {
      status: 403,
      error: msg || 'JWT_EXPIRED',
    },
    403
  );
};

export const throwREFRESHEXPIRED = (msg: string | null = null) => {
  throw new HttpException(
    {
      status: 419,
      error: msg || 'REFRESH_TOKEN_EXPIRED',
    },
    419
  );
};

export const throwACCESSDENIED = (msg: string | null = null) => {
  throw new HttpException(
    {
      status: 423,
      error: msg || 'ACCESS_DENIED',
    },
    423
  );
};

export const throwBADREQUEST = (msg: string | null = null) => {
  throw new HttpException(
    {
      status: 400,
      error: msg || 'BAD_REQUEST',
    },
    400
  );
};

export const throwNOTFOUND = (msg: string | null = null) => {
  throw new HttpException(
    {
      status: 404,
      error: msg || 'NOT_FOUND',
    },
    404
  );
};

export const throwINTERNALSERVERERROR = (msg: string | null = null) => {
  throw new HttpException(
    {
      status: 500,
      error: msg || 'INTERNAL_SERVER_ERROR',
    },
    500
  );
};
