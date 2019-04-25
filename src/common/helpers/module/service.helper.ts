import {
  DeepPartial,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  RemoveOptions,
  Repository,
  SaveOptions,
} from 'typeorm';

import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

type id = number | string;

export class ServiceHelper<T> {
  constructor(private readonly repository: Repository<T>) {}

  public async findAll(options: FindManyOptions<T> = {}) {
    return await this.repository.find(options);
  }

  // tslint:disable-next-line: no-shadowed-variable
  public async findOne(id: id, options: FindOneOptions<T> = {}) {
    return await this.repository.findOne(id, options);
  }

  public async findOneBy(where: FindConditions<T>, relations: string[] = []) {
    return await this.repository.findOne({ where, relations });
  }

  public async findByIds(ids: id[], options: FindManyOptions<T> = {}) {
    return await this.repository.findByIds(ids, options);
  }

  public async create(model: DeepPartial<T>, options: SaveOptions = {}) {
    const result = await this.repository.create(model);
    return await this.save(result, options);
  }

  // tslint:disable-next-line: no-shadowed-variable
  public async update(id: id, partial: QueryDeepPartialEntity<T>, options: FindOneOptions<T> = {}) {
    await this.repository.update(id, partial); // UpdateResult in PostgresQueryBuilder returning empty arrays
    return await this.findOne(id, options);
  }

  public async save(model: T, options: SaveOptions = {}) {
    return await this.repository.save<T>(model, options);
  }

  // tslint:disable-next-line: no-shadowed-variable
  public async delete(id: id, options: FindOneOptions<T> = {}) {
    const model = this.repository.findOne(id, options);
    await this.repository.delete(id); // DeleteResult in PostgresQueryBuilder returning empty arrays
    return model;
  }

  public async remove(models: T[], options: RemoveOptions = {}) {
    return await this.repository.remove(models, options);
  }
}
