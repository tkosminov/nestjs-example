export interface IAmqpOptions {
  exchange: string;
  routingKey: string;
  queue: string;
}

export type TAmqpResponse = 'ack' | 'nack';
