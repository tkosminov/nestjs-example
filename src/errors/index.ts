import { HttpException } from '@nestjs/common';

interface IErrData {
  msg?: string;
  raise?: boolean;
}

export const authorization_failed = (data?: IErrData, is_http_exception = true) => {
  let err: HttpException | Error = null;

  if (is_http_exception) {
    err = new HttpException(
      {
        status: 400,
        error: data?.msg || 'AUTHORIZATION_FAILED',
      },
      400
    );
  } else {
    err = new Error(data?.msg || 'AUTHORIZATION_FAILED');
  }

  if (data?.raise) {
    throw err;
  }

  return err;
};

export const unauthorized = (data?: IErrData, is_http_exception = true) => {
  let err: HttpException | Error = null;

  if (is_http_exception) {
    err = new HttpException(
      {
        status: 401,
        error: data?.msg || 'UNAUTHORIZED',
      },
      401
    );
  } else {
    err = new Error(data?.msg || 'UNAUTHORIZED');
  }

  if (data?.raise) {
    throw err;
  }

  return err;
};

export const access_token_expired_signature = (data?: IErrData, is_http_exception = true) => {
  let err: HttpException | Error = null;

  if (is_http_exception) {
    err = new HttpException(
      {
        status: 403,
        error: data?.msg || 'ACCESS_TOKEN_EXPIRED',
      },
      403
    );
  } else {
    err = new Error(data?.msg || 'ACCESS_TOKEN_EXPIRED');
  }

  if (data?.raise) {
    throw err;
  }

  return err;
};

export const refresh_token_expired_signature = (data?: IErrData, is_http_exception = true) => {
  let err: HttpException | Error = null;

  if (is_http_exception) {
    err = new HttpException(
      {
        status: 419,
        error: data?.msg || 'REFRESH_TOKEN_EXPIRED',
      },
      419
    );
  } else {
    err = new Error(data?.msg || 'REFRESH_TOKEN_EXPIRED');
  }

  if (data?.raise) {
    throw err;
  }

  return err;
};

export const access_denied = (data?: IErrData, is_http_exception = true) => {
  let err: HttpException | Error = null;

  if (is_http_exception) {
    err = new HttpException(
      {
        status: 403,
        error: data?.msg || 'ACCESS_DENIED',
      },
      403
    );
  } else {
    err = new Error(data?.msg || 'ACCESS_DENIED');
  }

  if (data?.raise) {
    throw err;
  }

  return err;
};

export const account_blocked = (data?: IErrData, is_http_exception = true) => {
  let err: HttpException | Error = null;

  if (is_http_exception) {
    err = new HttpException(
      {
        status: 423,
        error: data?.msg || 'ACCOUNT_BLOCKED',
      },
      423
    );
  } else {
    err = new Error(data?.msg || 'ACCOUNT_BLOCKED');
  }

  if (data?.raise) {
    throw err;
  }

  return err;
};

export const bad_request = (data?: IErrData, is_http_exception = true) => {
  let err: HttpException | Error = null;

  if (is_http_exception) {
    err = new HttpException(
      {
        status: 400,
        error: data?.msg || 'BAD_REQUEST',
      },
      400
    );
  } else {
    err = new Error(data?.msg || 'BAD_REQUEST');
  }

  if (data?.raise) {
    throw err;
  }

  return err;
};

export const not_found = (data?: IErrData, is_http_exception = true) => {
  let err: HttpException | Error = null;

  if (is_http_exception) {
    err = new HttpException(
      {
        status: 404,
        error: data?.msg || 'NOT_FOUND',
      },
      404
    );
  } else {
    err = new Error(data?.msg || 'NOT_FOUND');
  }

  if (data?.raise) {
    throw err;
  }

  return err;
};

export const internal_server_error = (data?: IErrData, is_http_exception = true) => {
  let err: HttpException | Error = null;

  if (is_http_exception) {
    err = new HttpException(
      {
        status: 500,
        error: data?.msg || 'INTERNAL_SERVER_ERROR',
      },
      500
    );
  } else {
    err = new Error(data?.msg || 'INTERNAL_SERVER_ERROR');
  }

  if (data?.raise) {
    throw err;
  }

  return err;
};

export const service_unavailable = (data?: IErrData, is_http_exception = true) => {
  let err: HttpException | Error = null;

  if (is_http_exception) {
    err = new HttpException(
      {
        status: 503,
        error: data?.msg || 'SERVICE_UNAVAILABLE',
      },
      503
    );
  } else {
    err = new Error(data?.msg || 'SERVICE_UNAVAILABLE');
  }

  if (data?.raise) {
    throw err;
  }

  return err;
};

export const cors_not_allowed = (data?: IErrData, is_http_exception = true) => {
  let err: HttpException | Error = null;

  if (is_http_exception) {
    err = new HttpException(
      {
        status: 400,
        error: data?.msg || 'CORS_NOT_ALLOWED',
      },
      400
    );
  } else {
    err = new Error(data?.msg || 'CORS_NOT_ALLOWED');
  }

  if (data?.raise) {
    throw err;
  }

  return err;
};
