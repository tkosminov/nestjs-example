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

  public async findOne(id: id, options: FindOneOptions<T> = {}) {
    return await this.repository.findOne(id, options);
  }

  public async findOneBy(where: FindConditions<T>, relations: string[] = []) {
    return await this.repository.findOne({ where, relations });
  }

  public async findByIds(ids: id[], options: FindManyOptions<T> = {}) {
    return await this.repository.findByIds(ids, options);
  }

  public async newModel(model: DeepPartial<T>) {
    return this.repository.create(model);
  }

  public async create(model: DeepPartial<T>, options: SaveOptions = {}) {
    const result = await this.newModel(model);
    return await this.save(result, options);
  }

  public async update(
    id: id,
    partial: QueryDeepPartialEntity<T>,
    options: FindOneOptions<T> = {},
  ) {
    await this.repository.update(id, partial);
    return this.findOne(id, options);
  }

  public async save(model: T, options: SaveOptions = {}) {
    return await this.repository.save<T>(model, options);
  }

  public async delete(id: id, options: FindOneOptions<T> = {}) {
    const model = this.repository.findOne(id, options);
    await this.repository.delete(id);
    return model;
  }

  public async remove(models: T[], options: RemoveOptions = {}) {
    return await this.repository.remove(models, options);
  }
}
