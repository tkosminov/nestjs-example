import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SectionCreateDTO } from './mutation-input/create.dto';
import { Section } from './section.entity';

@Injectable()
export class SectionService {
  constructor(@InjectRepository(Section) private readonly repository: Repository<Section>) {}

  public async create(data: SectionCreateDTO) {
    const {
      raw: [section],
    }: { raw: [Section] } = await this.repository.createQueryBuilder().insert().values(data).returning('*').execute();

    return section;
  }
}
