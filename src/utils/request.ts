import { Request, Response } from 'express';

export function getIp(req: Request): string {
  return req.ip ?? '-';
}

export function getForwardedIp(req: Request): string {
  let ips = req.get('X-Forwarded-For');

  if (ips?.length) {
    ips = ips.split(', ')[0];
  }

  return ips ?? '-';
}

export function getUrl(req: Request): string {
  return req.originalUrl || req.url || req.baseUrl || '-';
}

export function getPath(req: Request): string {
  return getUrl(req).split('?')[0];
}

export function getAction(req: Request): string {
  return getUrl(req).split('/').reverse()[0];
}

export function getHttpVersion(req: Request): string {
  return req.httpVersionMajor + '.' + req.httpVersionMinor;
}

export function getResponseHeader(res: Response, field: string) {
  if (!res.headersSent) {
    return undefined;
  }

  const header = res.getHeader(field);

  return Array.isArray(header) ? header.join(', ') : (header ?? '-');
}

export function getReferrer(req: Request) {
  let referrer = req.headers.referer ?? req.headers.referrer;

  if (Array.isArray(referrer)) {
    referrer = referrer[0];
  }

  return (referrer ?? '-').split('?')[0];
}

export function getOrigin(req: Request) {
  const origin = req.headers.origin;

  if (!origin || typeof origin === 'string') {
    return origin!;
  }

  return origin[0];
}

export function getMethod(req: Request) {
  return req.method;
}

export function getRequestHeader(req: Request, field: string) {
  return req.headers[field] as string;
}

export function getUserAgent(req: Request) {
  return getRequestHeader(req, 'user-agent') ?? '-';
}

export function getCookie(cookies: string, key: string): string | null {
  let value: string | null = null;

  cookies.split(';').forEach((cookie) => {
    if (cookie.trim().startsWith(`${key}=`)) {
      value = cookie.split('=')[1];
    }
  });

  return value;
}
