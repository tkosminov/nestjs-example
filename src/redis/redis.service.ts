import { Inject, Injectable } from '@nestjs/common';

import Redis, { RedisKey } from 'ioredis';
import { Observable, Observer } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { REDIS_EXPIRE_TIME_IN_SECONDS, REDIS_PUBLISHER_CLIENT, REDIS_SUBSCRIBER_CLIENT } from './redis.constants';

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

    return new Observable((observer: Observer<IRedisSubscribeMessage>) =>
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

  public async set(key: RedisKey, value: unknown, expire: number = REDIS_EXPIRE_TIME_IN_SECONDS) {
    await this.pubClient.set(key, JSON.stringify(value), 'EX', expire);
  }

  public async get<T = any>(key: RedisKey) {
    const res = await this.pubClient.get(key);

    return (await JSON.parse(res)) as T;
  }

  public async hset(key: RedisKey, field: string, value: string) {
    return await this.pubClient.hset(key, field, value);
  }

  public async hdel(key: RedisKey, ...fields: string[]) {
    return await this.pubClient.hdel(key, ...fields);
  }

  public async hget(key: RedisKey, field: string) {
    return await this.pubClient.hget(key, field);
  }

  public async hgetall(key: RedisKey): Promise<Record<string, string>> {
    return await this.pubClient.hgetall(key);
  }

  public async del(key: RedisKey) {
    return await this.pubClient.del(key);
  }

  public async mget(keys: RedisKey[]) {
    const res = await this.pubClient.mget(keys);

    return res.map((data) => JSON.parse(data || null));
  }

  public async mset(data: RedisKey[]) {
    await this.pubClient.mset(data);
  }
}
