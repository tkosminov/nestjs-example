import DataLoader from 'dataloader';

export interface ILoader {
  generateDataLoader(): DataLoader<unknown, unknown>;
}
