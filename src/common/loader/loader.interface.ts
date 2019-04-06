import DataLoader from 'dataloader';

export interface ILoader {
  // tslint:disable-next-line: no-any
  generateDataLoader(): DataLoader<any, any>;
}
