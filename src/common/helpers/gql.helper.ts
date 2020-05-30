const enumKeys: string[] = [];

const otherToGql = (value: unknown, isEnum: boolean): string => {
  if (isEnum) {
    return `${value}`;
  }

  return JSON.stringify(value);
};

const arrayToGql = (array: unknown[]): string => {
  let str = '[';

  array.forEach((item, index, _arr) => {
    if (index > 0) {
      str += ',';
    }
    if (typeof item === 'object' && !Array.isArray(item)) {
      str += toGQLQuery(item, true);
    } else if (Array.isArray(item)) {
      str += arrayToGql(item);
    } else {
      str += otherToGql(item, false);
    }
  });

  str += ']';

  return str;
};

const isEnumCheck = (value: string): boolean => {
  return enumKeys.indexOf(value) !== -1;
};

export const toGQLQuery = (obj: object, bracket: boolean): string => {
  let str = bracket ? '{' : '';

  Object.keys(obj).forEach((key, index, _arr) => {
    if (index > 0) {
      str += ',';
    }
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      str += `${key}:${toGQLQuery(obj[key], true)}`;
    } else if (Array.isArray(obj[key])) {
      str += `${key}:${arrayToGql(obj[key])}`;
    } else {
      str += `${key}:${otherToGql(obj[key], isEnumCheck(key))}`;
    }
  });

  str += bracket ? '}' : '';

  return str;
};
