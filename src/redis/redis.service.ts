import { Inject, Injectable } from '@nestjs/common';

import { KeyType, Redis } from 'ioredis';
import { Observable, Observer } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import {
  REDIS_EXPIRE_KEY_NAME,
  REDIS_EXPIRE_TIME_IN_SECONDS,
  REDIS_PUBLISHER_CLIENT,
  REDIS_SUBSCRIBER_CLIENT,
} from './redis.constants';

export interface IRedisSubscribeMessage {
  readonly message: string;
  readonly channel: string;
}

@Injectable()
export class RedisService {
  public constructor(
    @Inject(REDIS_SUBSCRIBER_CLIENT) private readonly subClient: Redis,
    @Inject(REDIS_PUBLISHER_CLIENT) private readonly pubClient: Redis
  ) {}

  public fromEvent<T>(eventName: string): Observable<T> {
    this.subClient.subscribe(eventName);

    return Observable.create((observer: Observer<IRedisSubscribeMessage>) =>
      this.subClient.on('message', (channel, message) => observer.next({ channel, message }))
    ).pipe(
      filter(({ channel }) => channel === eventName),
      map(({ message }) => JSON.parse(message))
    );
  }

  public async publish(channel: string, value: unknown): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      return this.pubClient.publish(channel, JSON.stringify(value), (error, reply) => {
        if (error) {
          return reject(error);
        }

        return resolve(reply);
      });
    });
  }

  public async set(key: KeyType, value: unknown) {
    await this.pubClient.set(key, JSON.stringify(value), REDIS_EXPIRE_KEY_NAME, REDIS_EXPIRE_TIME_IN_SECONDS);
  }

  public async get(key: KeyType) {
    const res = await this.pubClient.get(key);

    return await JSON.parse(res);
  }

  public async del(key: KeyType) {
    return await this.pubClient.del(key);
  }
}
