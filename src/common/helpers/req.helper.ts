import { Request, Response } from 'express';

export class ReqHelper {
  public getIp(req: Request): string {
    return req.ip || (req.connection && req.connection.remoteAddress) || '-';
  }

  public getUrl(req: Request): string {
    return req.originalUrl || req.url || req.baseUrl || '-';
  }

  public getHttpVersion(req: Request): string {
    return req.httpVersionMajor + '.' + req.httpVersionMinor;
  }

  public getResponseHeader(res: Response, field: string) {
    if (!res.headersSent) {
      return undefined;
    }

    const header = res.getHeader(field);

    return Array.isArray(header) ? header.join(', ') : header || '-';
  }

  public getReferrer(req: Request) {
    const referer = req.headers.referer || req.headers.referrer || '-';

    if (typeof referer === 'string') {
      return referer;
    }

    return referer[0];
  }

  public getOrigin(req: Request) {
    const origin = req.headers.origin;

    if (!origin || typeof origin === 'string') {
      return origin;
    }

    return origin[0];
  }

  public getMethod(req: Request) {
    return req.method;
  }

  public getUserAgent(req: Request) {
    return req.headers['user-agent'] || '-';
  }
}
