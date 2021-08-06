export function pluck<T, K>(array: T[], key: string): K[] {
  return array.map((a) => a[key]);
}

export function shuffle<T>(array: T[]): T[] {
  return array.sort(() => Math.random() - 0.5);
}

export function uniq<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

export function reduceToObject<T>(array: T[], key: string): { [K: string]: T } {
  return array.reduce((acc, curr) => {
    acc[curr[key]] = curr;

    return acc;
  }, {});
}

export function groupBy<T>(array: T[], key: string): { [key: string]: T[] } {
  return array.reduce((acc, curr) => {
    if (!acc.hasOwnProperty(curr[key])) {
      acc[curr[key]] = [];
    }

    acc[curr[key]].push(curr);

    return acc;
  }, {} as { [key: string]: T[] });
}
