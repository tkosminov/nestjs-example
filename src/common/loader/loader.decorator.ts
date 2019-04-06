import { ReflectMetadata, Type } from '@nestjs/common';

import { ILoader } from './loader.interface';

// tslint:disable-next-line: variable-name
export const Loader = (loader: Type<ILoader>) => ReflectMetadata('dataloader', loader);
