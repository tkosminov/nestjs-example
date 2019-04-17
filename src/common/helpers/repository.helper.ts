import { Permission } from '../../permission/permission.entity';
import { User } from '../../user/user.entity';

import { FindConditions, FindManyOptions, FindOneOptions, Repository } from 'typeorm';

type Entity = User | Permission;

export class RepositoryHelper<T extends Entity = Entity> {
  constructor(private readonly repository: Repository<T>) {}

  public async findAll(options: FindManyOptions<T> = {}) {
    return await this.repository.find(options);
  }

  public async findOne(id: number | string, options: FindOneOptions<T> = {}) {
    return await this.repository.findOne(id, options);
  }

  public async findByIds(ids: number[] | string[], options: FindManyOptions<T> = {}) {
    return await this.repository.findByIds(ids, options);
  }

  public async findOneBy(where: FindConditions<T>, relations: string[] = []) {
    return await this.repository.findOne({ where, relations });
  }

  public async delete(id: number | string) {
    const model = await this.repository.findOne(id);
    await this.repository.delete(model.id);
    return model;
  }
}
