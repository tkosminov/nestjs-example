import { stringify } from 'query-string';

export function pluck<T, K>(array: T[], key: string): K[] {
  return array.map((a) => a[key]);
}

export const createUrlWithQuery = (url: string, query: object = {}): string => {
  return `${url}?${stringify({ ...query })}`;
};

export const convertToHex = (str: string) => {
  let hex = '';
  for (let i = 0; i < str.length; i++) {
    hex += '' + str.charCodeAt(i).toString(16);
  }
  return hex;
};

export const generateToken = (length = 64) => {
  let text = '';
  const possible =
    '0123456789QAZWSXEDCRFVTGBYHNUJMIKOLPqazwsxedcrfvtgbyhnujmikolp';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};
