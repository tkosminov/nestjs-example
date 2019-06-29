import { Request, Response } from 'express';

// tslint:disable: no-feature-envy
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
    return req.headers.referer || req.headers.referrer || '-';
  }

  public getUserAgent(req: Request) {
    return req.headers['user-agent'] || '-';
  }
}
