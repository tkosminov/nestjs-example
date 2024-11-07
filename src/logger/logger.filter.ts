const FILTERED = 'FILTERED';

const EMAIL_REGEX = /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/gi;
const JWT_REGEX = /^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-\+\/=]*)/gi;
const KEY_VALUE_REGEX = /("([^"]+)"|'([^']+)'|`([^`]+)`|[\w]+)\s*[:=-]\s*("([^"]+)"|'([^']+)'|`([^`]+)`|[\w]+)/gi;

function filterValue(keywords: string[], value: unknown, field?: string) {
  if (value) {
    if (field && keywords.includes(field)) {
      return FILTERED;
    }

    if (typeof value === 'string') {
      let new_value: string = value.replace(EMAIL_REGEX, FILTERED);
      new_value = new_value.replace(JWT_REGEX, FILTERED);
      new_value = new_value.replace(KEY_VALUE_REGEX, (match, key) => {
        const keyword = key.replace(/['"`\s]/gi, '');

        if (keywords.includes(keyword)) {
          return `${keyword}: ${FILTERED}`;
        }

        return match;
      });

      return new_value;
    }
  }

  return value;
}

function filterUnknown(keywords: string[], value: unknown, field?: string) {
  if (field && keywords.includes(field)) {
    return FILTERED;
  }

  if (value) {
    if (Array.isArray(value)) {
      return filterArray(keywords, value);
    } else if (typeof value === 'object' && !(value instanceof Date)) {
      return filterObject(keywords, value);
    } else {
      return filterValue(keywords, value, field);
    }
  }

  return value;
}

function filterObject(keywords: string[], obj: object) {
  const filtered_object: Record<string, unknown> = {};

  Object.keys(obj).forEach((key) => {
    filtered_object[key] = filterUnknown(keywords, obj[key], key);
  });

  return filtered_object;
}

function filterArray(keywords: string[], arr: unknown[]) {
  return Array.from(arr).map((value) => filterUnknown(keywords, value));
}

export function filterContext(keywords: string[], context: Record<string, unknown>) {
  return filterObject(keywords, context);
}

export function filterMessage(keywords: string[], message: unknown) {
  return filterUnknown(keywords, message);
}
