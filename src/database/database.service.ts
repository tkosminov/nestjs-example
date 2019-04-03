import { Inject, Injectable } from '@nestjs/common';
import { Connection, EntitySchema, Repository } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(@Inject('Connection') public connection: Connection) {}

  public async getRepository<T>(entity: EntitySchema<T>): Promise<Repository<T>> {
    return this.connection.getRepository(entity);
  }
}
